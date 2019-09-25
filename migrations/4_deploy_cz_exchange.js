const CzExchange = artifacts.require("./CzExchange.sol");


module.exports = function(deployer, network, accounts) {
  let name = "Skale Token"
  let symbol = "SKT"
  let tokenId = 1;
  let tokenURI = "https://ipfs.io/ipfs/QmYMYdJqSrTNB3iwXzmYfGdjAymuXvHAJuum9zzT7RV7N1";

  // let proxyRegistryAddress = ""
  // if (network === 'rinkeby') {
  //   proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  // } else {
  //   proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  // }

  deployer.deploy(
    CzExchange,
    name, 
    symbol,
    tokenId,
    tokenURI,
    //proxyRegistryAddress, 
    { gas: 5000000 }
  );
};
