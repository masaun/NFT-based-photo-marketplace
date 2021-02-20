const PhotoNFTMarketPlace = artifacts.require("./PhotoNFTMarketPlace.sol");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(PhotoNFTMarketPlace);
};
