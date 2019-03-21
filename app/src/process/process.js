import Web3 from "web3";
import contract from "truffle-contract";
import '.././styles/main.css';
import '.././animation/animate.css';
import SupplyChainArtifact from "../../../build/contracts/SupplyChain.json";

const SupplyChain = contract(SupplyChainArtifact);

const App = {

    start : async function() {
  
      let provider = new Web3.providers.HttpProvider("http://localhost:7545");
      web3 = new Web3(provider);
      SupplyChain.setProvider(provider);
  
      web3.eth.getAccounts(function (err, accounts) {
        if (err != null) {
          alert('There was an error fetching your accounts.')
          return
        }
  
        if (accounts.length === 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
          return
        }
  
        deployerId = accounts[0];
  
      });
    }
  };
  