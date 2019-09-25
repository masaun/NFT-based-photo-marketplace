const Web3 = require('web3')
//const { waitForEvent } = require('./utils')        // Original
const { waitForEvent } = require('./1_test_utils')   // New
const ethPriceContract = artifacts.require('./EthPrice.sol')
const { expectRevert } = require('openzeppelin-test-helpers')
const web3WithWebsockets = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:9545'))

contract('Eth Price Tests', ([ owner ]) => {
  let contractEvents
  let contractMethods
  let contractAddress
  let ethPriceFromContractEvent

  const GAS_LIMIT = 3e6
  const PROVABLE_QUERY_EVENT = 'LogNewProvableQuery'
  const PROVABLE_QUERY_STRING = 'Provable query in-flight!'

  it('Should get contract instantiation for listening to events', async () => {
    // Using deployed contract
    const { contract: deployedContract } = await ethPriceContract.deployed()

    // Using websocket
    const { methods, events } = new web3WithWebsockets.eth.Contract(
      deployedContract._jsonInterface,
      deployedContract._address
    )
    contractEvents = events
    contractMethods = methods
    contractAddress = deployedContract._address
  })

  it('Should have logged a new Provable query on contract creation', async () => {
    const {
      returnValues: {
        _description
      }
    } = await waitForEvent(contractEvents[PROVABLE_QUERY_EVENT])
    assert(
      _description === PROVABLE_QUERY_STRING,
      'Provable query incorrectly logged!'
    )
  })

  it('Callback should have logged a new ETH price', async () => {
    const {
      returnValues: {
        _priceInCents
      }
    } = await waitForEvent(contractEvents.LogNewEthPrice)
    ethPriceFromContractEvent = _priceInCents
    assert(
      parseInt(_priceInCents) > 0,
      'A price should have been retrieved from Provable call!'
    )
  })

  it('Should set ETH price correctly in contract', async () => {
    const ethPriceInStorage = await contractMethods
      .ethPriceCents()
      .call()
  })

  it('Should revert on second query attempt due to lack of funds', async () => {
    const contractBalance = await web3.eth.getBalance(contractAddress)
    assert(parseInt(contractBalance) === 0)
    await expectRevert.unspecified(
      contractMethods
        .fetchEthPriceViaProvable()
        .send({
          from: owner,
          gas: GAS_LIMIT
        })
    )
  })

  it('Should succeed on a second query attempt when sending funds', async () => {
    const ETH_AMOUNT = 1e16
    contractMethods
      .fetchEthPriceViaProvable()
      .send({
        from: owner,
        gas: GAS_LIMIT,
        value: ETH_AMOUNT
      })
    const {
      returnValues: {
        _description
      }
    } = await waitForEvent(contractEvents[PROVABLE_QUERY_EVENT])
    assert(
      _description === PROVABLE_QUERY_STRING,
      'Provable query incorrectly logged!'
    )
  })
})
