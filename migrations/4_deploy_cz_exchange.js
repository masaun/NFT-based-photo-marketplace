const CzExchange = artifacts.require("./CzExchange.sol");


module.exports = function(deployer, network, accounts) {
  deployer.deploy(CzExchange);
};
