const PhotoNFTFactory = artifacts.require("./PhotoNFTFactory.sol");
const PhotoNFTMarketPlace = artifacts.require("./PhotoNFTMarketPlace.sol");

const _photoNFTMarketPlace = PhotoNFTMarketPlace.address;

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(PhotoNFTFactory, _photoNFTMarketPlace);
};
