import Web3 from "web3";
import contract from "truffle-contract";
import './styles/main.css';
import './animation/animate.css';
import SupplyChainArtifact from "../../build/contracts/SupplyChain.json";


const SupplyChain = contract(SupplyChainArtifact);

var accounts;
var deployerId;
var producerId;
var distributorId;
var retailerId;
var customerId;
var supplyChain;

const App = {
  start : function() {
    const self = this;

    SupplyChain.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      deployerId = accounts[0];
      producerId = accounts[1];
      distributorId = accounts[2];
      retailerId = accounts[3];
      customerId = accounts[4];

      document.getElementById("producer-id").value = producerId;
    })

      SupplyChain.deployed().then(function(instance) {
        supplyChain = instance;
        return supplyChain.isProducer(deployerId);
      }).then(function (error, result) {
        if (!error)
          return supplyChain.isDistributor(deployerId);
      }).then(function (error, result) {
          if (!error)
          return supplyChain.isRetailer(deployerId);
      }).then(function (error, result) {
          if (!error)
          return supplyChain.isCustomer(deployerId);
      });
  },

  registerFarm : async() => {

    const vineyardLatitude = document.getElementById("vineyard-latitude").value;
    const vineyardLongitude = document.getElementById("vineyard-longitude").value;
    const vineyardName = document.getElementById("vineyard-name").value;
    const vineyardAddress = document.getElementById("vineyard-address").value;

    SupplyChain.deployed().then(function (instance) {
      supplyChain = instance;
      return supplyChain.isProducer(producerId, {from:deployerId});
    }).then(function(error, result) {
      if (!error) {
        return SupplyChain.registerFarm(vineyardName, vineyardLatitude, vineyardLongitude, vineyardAddress, {from: producerId});
      }
    }).then(function(error, result) {
        if (!error) {
          return supplyChain.getFarmInfo.call(1);
        }
    }).then(function(result) {
        document.getElementById("details-producer-id").value = producerId;
        document.getElementById("details-vineyard-id").value = result[0];
        document.getElementById("details-vineyard-name").value = result[1];
        document.getElementById("details-vineyard-latitude").value = result[2];
        document.getElementById("details-vineyard-longitude").value = result[3];
        document.getElementById("details-vineyard-address").value = result[4];
    })
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
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
