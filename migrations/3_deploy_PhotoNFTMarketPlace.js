const PhotoNFTMarketPlace = artifacts.require("./PhotoNFTMarketPlace.sol");
const PhotoNFTTradable = artifacts.require("./PhotoNFTTradable.sol");

const _photoNFTTradable = PhotoNFTTradable.address;

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(PhotoNFTMarketPlace, _photoNFTTradable);
};
