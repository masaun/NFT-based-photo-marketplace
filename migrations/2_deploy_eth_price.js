const EthPrice = [ artifacts.require('./EthPrice.sol') ]

module.exports = _deployer =>
  EthPrice.map(_contract =>
    _deployer.deploy(_contract))
