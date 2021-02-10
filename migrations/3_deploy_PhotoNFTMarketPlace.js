const PhotoNFTMarketPlace = artifacts.require("./PhotoNFTMarketPlace.sol");
const PhotoNFTFactory = artifacts.require("./PhotoNFTFactory.sol");

const _photoNFTFactory = PhotoNFTFactory.address;

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(PhotoNFTMarketPlace, _photoNFTFactory);
};
