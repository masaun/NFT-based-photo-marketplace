const PhotoNFTTradable = artifacts.require("./PhotoNFTTradable.sol");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(PhotoNFTTradable);
};
