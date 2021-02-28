const PhotoNFTMarketplace = artifacts.require("./PhotoNFTMarketplace.sol");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(PhotoNFTMarketplace);
};
