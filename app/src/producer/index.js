import Web3 from "web3";
import contract from "truffle-contract";
import '.././styles/main.css';
import '.././animation/animate.css';
import SupplyChainArtifact from "../../../build/contracts/SupplyChain.json";

const SupplyChain = contract(SupplyChainArtifact);

var producerId;

const App = {

  start : async function() {

    SupplyChain.setProvider(web3.currentProvider);

    web3.eth.getAccounts(function (err, accounts) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accounts.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      producerId = accounts[0];
    });

    const supplyChain = await SupplyChain.deployed()

    console.log("Producer ID: " + producerId);

    await supplyChain.addProducer(producerId, {from: producerId});
  },

  registerFarm : async() => {

    const supplyChain = await SupplyChain.deployed()

    await supplyChain.addProducer(producerId, {from: producerId});

    const vineyardLatitude = document.getElementById("vineyard-latitude").value;
    const vineyardLongitude = document.getElementById("vineyard-longitude").value;
    const vineyardName = document.getElementById("vineyard-name").value;
    const vineyardAddress = document.getElementById("vineyard-address").value;

    await supplyChain.registerFarm(vineyardName, vineyardLatitude, vineyardLongitude, vineyardAddress, {from: producerId});
  
    const results = await supplyChain.getFarmInfo.call(1);
        
    document.getElementById("details-producer-id").value = producerId;
    document.getElementById("details-vineyard-id").value = results[0];
    document.getElementById("details-vineyard-name").value = results[1];
    document.getElementById("details-vineyard-latitude").value = results[2];
    document.getElementById("details-vineyard-longitude").value = results[3];
    document.getElementById("details-vineyard-address").value = results[4];

    var proceed = document.getElementById("details-proceed-button");
    proceed.style.display = "block";
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
  }else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );
  }

  App.start();
});
