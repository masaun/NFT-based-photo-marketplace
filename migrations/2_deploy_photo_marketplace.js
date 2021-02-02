const PhotoMarketPlace = artifacts.require("./PhotoMarketPlace.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(PhotoMarketPlace);
};
