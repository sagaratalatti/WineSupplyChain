import Web3 from "web3";
import contract from "truffle-contract";
import '.././styles/main.css';
import '.././animation/animate.css';
import SupplyChainArtifact from "../../../build/contracts/SupplyChain.json";

const SupplyChain = contract(SupplyChainArtifact);

var producerId;
var distributorId;
var retailerId;
var customerId;

const App = {

    start : async function() {
  
      //SupplyChain.setProvider(web3.currentProvider);

      let provider = new Web3.providers.HttpProvider("http://localhost:8545");

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
  
        producerId = accounts[1];
        distributorId = accounts[2];
        retailerId = accounts[3];
        customerId = accounts[4];
  
      });
    },

    harvestGrapes : async () => {

      const supplyChain = await SupplyChain.deployed();

      const vintageYear = document.getElementById('grapes-vintage');
      const farmId = document.getElementById('farm-id');
      const grapesNotes = document.getElementById('grapes-notes')

      await supplyChain.harvestGrapes(grapesNotes, vintageYear, farmId, {from: producerId});

      const harvestEvent = await SupplyChain.GrapesHarvested();

      harvestEvent.watch(function(error, result) {
        if (!error) {
          result.args.grapesId;
        } else {
          console.log(error);
        }
      })
    },

    pressGrapes : async () => {

      const supplyChain = await SupplyChain.deployed();

      const grapesId = document.getElementById('press-grapes-id');

      await supplyChain.pressGrapes(grapesId, {from: producerId});

      const pressEvent = await SupplyChain.GrapesPressed();

      pressEvent.watch(function(error, result) {
        if (!error) {
          result.args.grapesId;
        } else {
          console.log(error);
        }
      })
    },

    fermentGrapes : async () => {

      const supplyChain = await SupplyChain.deployed();

      const grapesId = document.getElementById('ferment-grapes-id');

      await supplyChain.fermentGrapes(grapesId, {from: producerId});

      const fermentationEvent =  await SupplyChain.GrapesFermented();

      fermentationEvent.watch(function(error, result) {
        if (!error) {
          result.args.grapesId;
        } else {
          console.log(error);
        }
      });
    },

    processWine : async () => {

      const supplyChain = await SupplyChain.deployed();

      const grapesId = document.getElementById('wine-grapes-id');
      const price = document.getElementById('wine-bottle-price');
      const notes = document.getElementById('wine-notes');

      await supplyChain.bottlingWine(grapesId, price, notes, {from: producerId});

      const processEvent = await SupplyChain.WineBottled();

      processEvent.watch(function(error, result) {
        if (!error) {
          result.args.sku;
        } else {
          console.log(error);
        }
      });
    },

    buyBottleForDistribution : async () => {

      const supplyChain = await SupplyChain.deployed();

      await supplyChain.addDistributor(distributorId, {from: distributorId});

      const bottleId = document.getElementById('dist-bottle-id')
      const bottlePrice = document.getElementById('dist-bottle-price');

      await supplyChain.bottleForDistributionSale(bottleId, bottlePrice, {from: distributorId, value: bottlePrice});
      
      const distributionEvent =  await SupplyChain.WineBottleForDistributionSold();

      distributionEvent.watch(function(error, result) {
        if (!error) {
          result.args.sku;
        } else {
          console.log(error);
        }
      });
    },

    buyBottleForRetail : async () => {

      const supplyChain = await SupplyChain.deployed();

      await supplyChain.addRetailer(retailerId, {from: retailerId});

      const bottleId = document.getElementById('ret-bottle-id');
      const bottlePrice = document.getElementById('ret-bottle-price');

      await supplyChain.bottleShipForRetail(bottleId, bottlePrice, {from: retailerId, value: bottlePrice});

      const retailEvent = await SupplyChain.WineBottleRetailReceived();

      retailEvent.watch(function(error, result) {
        if (!error) {
          result.args.sku;
        } else {
          console.log(error);
        }
      });
    },

    bottleForSale : async () => {

      const supplyChain = await SupplyChain.deployed();

      const bottleId = document.getElementById('sale-bottle-id');
      const bottlePrice = document.getElementById('sale-bottle-price');

      await supplyChain.bottleForSale(bottleId, bottlePrice, {from: retailerId, value: bottlePrice});

      const saleEvent = await SupplyChain.WineBottleForSale();

      saleEvent.watch(function(error, result) {
        if (!error) {
          result.args.sku;
        } else {
          console.log(error);
        }
      });
    },

    buyBottle : async () => {

      const supplyChain = await SupplyChain.deployed();

      await supplyChain.addCustomer(customerId, {from: customerId});

      const bottleId = document.getElementById('wine-bottle-id');
      const bottlePrice = document.getElementById('wine-bottle-price');

      await supplyChain.buyBottle(bottleId, bottlePrice, {from: customerId, value: bottlePrice});

      const buyEvent = await SupplyChain.WineBottleSold();

      buyEvent.watch(function(error, result) {
        if (!error) {
          result.args.sku;
        } else {
          console.log(error);
        }
      });
    },

    shipBottle : async () => {

      const supplyChain = await SupplyChain.deployed();

      const bottleId = document.getElementById('ship-bottle-id');
      
      await supplyChain.shipBottle(bottleId, {from: retailerId});

      const shipEvent = await SupplyChain.WineBottleShipped();

      shipEvent.watch(function(error, result) {
        if (!error) {
          result.args.sku;
        } else {
          console.log(error);
        }
      });
    },

    receivedBottle : async () => {

      const supplyChain = await SupplyChain.deployed();

      const bottleId = document.getElementById('mark-bottle-received');

      await supplyChain.BottleReceived(bottleId, {from: customerId});

      const receivedEvent = await SupplyChain.WineBottleReceived();

      receivedEvent.watch(function(error, result) {
        if (!error) {
          result.args.sku;
        } else {
          console.log(error);
        }
      })
    },
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

  