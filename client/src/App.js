import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "./utils/getWeb3";
import Header from "./components/Header/index.js";
import Footer from "./components/Footer/index.js";
import Hero from "./components/Hero/index.js";
import Web3Info from "./components/Web3Info/index.js";
import ipfs from './components/ipfs/ipfsApi.js'

import { Loader, Button, Card, Input, Heading, Table, Form, Flex, Box, Image } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../config/webpack';
import styles from './App.module.scss';


import ethPriceContract from '../../contracts/oracle/EthPrice.sol';
import { waitForEvent } from '../../test/1_test_utils.js';



class App extends Component {
  constructor(props) {    
    super(props);

    this.state = {
      /////// Default state
      storageValue: 0,
      web3: null,
      accounts: null,
      route: window.location.pathname.replace("/", ""),

      /////// Ipfs Upload
      buffer: null,
      ipfsHash: ''
    };

    this.getTestData = this.getTestData.bind(this);

    /////// Ipfs Upload
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  ///////--------------------- Functions of CzExchange ---------------------------



  ///////--------------------- Functions of testFunc ---------------------------  
  getTestData = async () => {

    const { accounts, cz_exchange, eth_price, abi, address, web3 } = this.state;

    const { events: websocketsEvents } = new web3.eth.Contract(
      abi,
      address
    )

    const response_1 = await cz_exchange.methods.testFunc().send({ from: accounts[0] })
    console.log('=== response of testFunc function ===', response_1);      // Debug

    const callProvableAndWaitForResult = _ => 
      eth_price.methods.fetchEthPriceViaProvable()
        .send({ from: accounts[0], value: 1e17 })
        .then(_ => waitForEvent(websocketsEvents.LogNewEthPrice))

    await callProvableAndWaitForResult()

    const resultFromContract = await eth_price.methods.ethPriceCents().call()
    console.log('=== response of fetchEthPriceViaProvable function ===', resultFromContract);    

  }


  ///////--------------------- Functions of ipfsUpload ---------------------------  
  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)  // Read bufffered file

    // Callback
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('=== buffer ===', this.state.buffer)
    }
  }
  
  onSubmit(event) {
    event.preventDefault()

    ipfs.files.add(this.state.buffer, (error, result) => {
      // In case of fail to upload to IPFS
      if (error) {
        console.error(error)
        return
      }

      // In case of successful to upload to IPFS
      this.setState({ ipfsHash: result[0].hash })
      console.log('=== ipfsHash ===', this.state.ipfsHash)
    })
  }  



  //////////////////////////////////// 
  ///// Ganache
  ////////////////////////////////////
  getGanacheAddresses = async () => {
    if (!this.ganacheProvider) {
      this.ganacheProvider = getGanacheWeb3();
    }
    if (this.ganacheProvider) {
      return await this.ganacheProvider.eth.getAccounts();
    }
    return [];
  }

  componentDidMount = async () => {
    const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
 
    let CzExchange = {};
    let EthPrice = {};

    try {
      CzExchange = require("../../build/contracts/CzExchange.json");              // Load ABI of contract of CzExchange
      EthPrice = require("../../build/contracts/EthPrice.json");  // Load ABI of contract of EthPrice
    } catch (e) {
      console.log(e);
    }

    try {
      const isProd = process.env.NODE_ENV === 'production';
      if (!isProd) {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        let ganacheAccounts = [];

        try {
          ganacheAccounts = await this.getGanacheAddresses();
        } catch (e) {
          console.log('Ganache is not running');
        }

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const networkType = await web3.eth.net.getNetworkType();
        const isMetaMask = web3.currentProvider.isMetaMask;
        let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
        balance = web3.utils.fromWei(balance, 'ether');

        let instanceCzExchange = null;
        let instanceEthPrice = null;
        let deployedNetwork = null;

        // Create instance of contracts
        if (CzExchange.networks) {
          deployedNetwork = CzExchange.networks[networkId.toString()];
          if (deployedNetwork) {
            instanceCzExchange = new web3.eth.Contract(
              CzExchange.abi,
              deployedNetwork && deployedNetwork.address,
            );
            console.log('=== instanceCzExchange ===', instanceCzExchange);
          }
        }
        if (EthPrice.networks) {
          deployedNetwork = EthPrice.networks[networkId.toString()];
          if (deployedNetwork) {
            instanceEthPrice = new web3.eth.Contract(
              EthPrice.abi,
              deployedNetwork && deployedNetwork.address,
            );
            console.log('=== instanceEthPrice ===', instanceEthPrice);
          }
        }

        if (instanceCzExchange || instanceEthPrice) {
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled,
            isMetaMask, cz_exchange: instanceCzExchange, eth_price: instanceEthPrice, abi: EthPrice.abi, address: deployedNetwork.address }, () => {
              this.refreshValues(instanceCzExchange, instanceEthPrice);
              setInterval(() => {
                this.refreshValues(instanceCzExchange, instanceEthPrice);
              }, 5000);
            });
        }
        else {
          this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
        }
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  refreshValues = (instanceCzExchange, instanceEthPrice) => {
    if (instanceCzExchange) {
      console.log('refreshValues of instanceCzExchange');
    }
    if (instanceEthPrice) {
      console.log('refreshValues of instanceEthPrice');
    }
  }

  renderLoader() {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  renderDeployCheck(instructionsKey) {
    return (
      <div className={styles.setup}>
        <div className={styles.notice}>
          Your <b> contracts are not deployed</b> in this network. Two potential reasons: <br />
          <p>
            Maybe you are in the wrong network? Point Metamask to localhost.<br />
            You contract is not deployed. Follow the instructions below.
          </p>
        </div>
      </div>
    );
  }

  renderInstructions() {
    return (
      <div className={styles.wrapper}>
        <Hero />
      </div>
    );
  }

  renderCzExchange() {
    return (
      <div className={styles.wrapper}>
      {!this.state.web3 && this.renderLoader()}
      {this.state.web3 && !this.state.cz_exchange && (
        this.renderDeployCheck('cz_exchange')
      )}
      {this.state.web3 && this.state.cz_exchange && (
        <div className={styles.contracts}>
          <h2>Photo Upload to IPFS</h2>          
          <img src={ `https://ipfs.io/ipfs/${this.state.ipfsHash}` } alt="" />

          <form onSubmit={this.onSubmit}>
            <input type='file' onChange={this.captureFile} />
            <input type='submit' />
          </form>
          
          <hr />


          <h2>NFT based Photo MarketPlace</h2>

          <div className={styles.widgets}>
            <Card width={'30%'} bg="primary">
              <h4>Photo #1</h4>

              <Image
                alt="random unsplash image"
                borderRadius={8}
                height="auto"
                maxWidth='100%'
                src="https://source.unsplash.com/random/1280x720"
              />

              <span style={{ padding: "20px" }}></span>

              <br />

              <Button size={'small'} onClick={this.getTestData}>Buy</Button>
            </Card>
   
            <Card width={'30%'} bg="primary">
              <h4>Photo #2</h4>

              <Image
                alt="random unsplash image"
                borderRadius={8}
                height="auto"
                maxWidth='100%'
                src="https://source.unsplash.com/random/1280x720"
              />

              <span style={{ padding: "20px" }}></span>

              <br />

              <Button size={'small'} onClick={this.getTestData}>Buy</Button>
            </Card>

            <Card width={'30%'} bg="primary">
              <h4>Photo #3</h4>

              <Image
                alt="random unsplash image"
                borderRadius={8}
                height="auto"
                maxWidth='100%'
                src="https://source.unsplash.com/random/1280x720"
              />

              <span style={{ padding: "20px" }}></span>

              <br />

              <Button size={'small'} onClick={this.getTestData}>Buy</Button>
            </Card>
          </div>


          <div className={styles.widgets}>
            <Card width={'30%'} bg="primary">
              <h4>Photo #4</h4>

              <Image
                alt="random unsplash image"
                borderRadius={8}
                height="auto"
                maxWidth='100%'
                src="https://source.unsplash.com/random/1280x720"
              />

              <span style={{ padding: "20px" }}></span>

              <br />

              <Button size={'small'} onClick={this.getTestData}>Buy</Button>
            </Card>
   
            <Card width={'30%'} bg="primary">
              <h4>Photo #5</h4>

              <Image
                alt="random unsplash image"
                borderRadius={8}
                height="auto"
                maxWidth='100%'
                src="https://source.unsplash.com/random/1280x720"
              />

              <span style={{ padding: "20px" }}></span>

              <br />

              <Button size={'small'} onClick={this.getTestData}>Buy</Button>
            </Card>

            <Card width={'30%'} bg="primary">
              <h4>Photo #6</h4>

              <Image
                alt="random unsplash image"
                borderRadius={8}
                height="auto"
                maxWidth='100%'
                src="https://source.unsplash.com/random/1280x720"
              />

              <span style={{ padding: "20px" }}></span>

              <br />

              <Button size={'small'} onClick={this.getTestData}>Buy</Button>
            </Card>
          </div>


        </div>
      )}
      </div>
    );
  }

  render() {
    return (
      <div className={styles.App}>
        <Header />
          {this.state.route === '' && this.renderInstructions()}
          {this.state.route === 'cz_exchange' && this.renderCzExchange()}
        <Footer />
      </div>
    );
  }
}

export default App;
