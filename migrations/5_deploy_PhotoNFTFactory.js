const PhotoNFTFactory = artifacts.require("./PhotoNFTFactory.sol");
const PhotoNFTMarketPlace = artifacts.require("./PhotoNFTMarketPlace.sol");
const PhotoNFTData = artifacts.require("./PhotoNFTData.sol");

const _photoNFTMarketPlace = PhotoNFTMarketPlace.address;
const _photoNFTData = PhotoNFTData.address;

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(PhotoNFTFactory, _photoNFTMarketPlace, _photoNFTData);
};
