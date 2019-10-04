const PhotoMarketPlace = artifacts.require("./PhotoMarketPlace.sol");

// Contract address of DAI at Ropsten
let DaiContractAddr = '0xaD6D458402F60fD3Bd25163575031ACDce07538D'

module.exports = function(deployer, network, accounts) {
  deployer.deploy(
    PhotoMarketPlace,
    DaiContractAddr
  );
};
