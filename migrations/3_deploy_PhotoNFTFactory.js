const PhotoNFTFactory = artifacts.require("./PhotoNFTFactory.sol");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(PhotoNFTFactory);
};
