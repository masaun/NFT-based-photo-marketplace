const path = require("path");
require('dotenv').config();

//const mnemonic = process.env.MNENOMIC;
const HDWalletProvider = require('@truffle/hdwallet-provider');  // @notice - Should use new module.

// Create your own key for Production environments (https://infura.io/)
const INFURA_API_KEY = process.env.INFURA_API_KEY;


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      //port: 7545,     // Ganache-GUI
      port: 8545,   // Ganache-CLI
      network_id: "*",
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider("Put your mnemonic of Metamask", 'https://ropsten.infura.io/v3/' + process.env.INFURA_API_KEY)
      },
      network_id: '3',
      gas: 4465030,
      gasPrice: 10000000000,
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(MNENOMIC, 'https://kovan.infura.io/v3/' + process.env.INFURA_API_KEY)
      },
      network_id: '42',
      gas: 4465030,
      gasPrice: 10000000000,
    },

    rinkeby: {
      provider: function() {
        return new HDWalletProvider("Put your mnemonic of Metamask", "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY);
      },
      network_id: '4',
      gas: 3000000,
      gasPrice: 10000000000,
    },
    main: {
      provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 1,
      gas: 3000000,
      gasPrice: 10000000000
    }
  }
};
