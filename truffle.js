require('babel-register')
var HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = 'aim consider north pig logic siren sugar gas term try alcohol flower';
const infura = 'https://rinkeby.infura.io/v3/b849c86a78784e47bbe4c7ca57f8f222'

module.exports = {

  compilers: {
    solc: {
      version: "0.4.24",
      }
    },

    networks: {
      
      development: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "5777" // Match any network id
      },

      rinkeby: {
        provider: () => new HDWalletProvider(mnemonic, infura),
        network_id: 4,
        gas: 6700000,
        gasPrice : 10000000000
      }
    },
  };