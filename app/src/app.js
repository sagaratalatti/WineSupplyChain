import './styles/main.css'
import './animation/animate.css'
import Web3 from 'web3';
import contract from 'truffle-contract';

import supplyChain_artifact from '../../build/contracts/SupplyChain.json';
var SupplyChain = contract(supplyChain_artifact);

var account;
var accounts;

const App = {

    start : async () => {

        SupplyChain.setProvider(web3.currentProvider);

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
            account = accounts[0];
          });

          window.ethereum.on('accountsChanged', function (accounts) {
            account = accounts[0]
            console.log("callback address: " + accounts[0]);
          })
    },

    registerFarm : async () => {

        const supplyChain = await SupplyChain.deployed();
        const deployer = await supplyChain.owner.call({from: account})

        if (await !supplyChain.isProducer(account, {from: deployer})) {
          await supplyChain.addProducer(account, {from: deployer});
        }
        
        const farmId = parseInt(document.getElementById('farm-farm-id').value);
        const latitude = document.getElementById('farm-vineyard-latitude').value;
        const longitude = document.getElementById('farm-vineyard-longitude').value;
        const farmName = document.getElementById('farm-vineyard-name').value;
        const address = document.getElementById('farm-vineyard-address').value;
        
        await supplyChain.registerFarm(farmId, farmName, latitude, longitude, address, {from: account});

        const resultFarm = await supplyChain.getFarmInfo.call(farmId);

        document.getElementById('details-producer-id').value = account;
        document.getElementById('details-vineyard-id').value = resultFarm[0]
        document.getElementById('details-vineyard-name').value = resultFarm[1]
        document.getElementById('details-vineyard-latitude').value = resultFarm[2]
        document.getElementById('details-vineyard-longitude').value = resultFarm[3]
        document.getElementById('details-vineyard-address').value = resultFarm[4]
        
    },

    harvestGrapes : async () => {

        const supplyChain = await SupplyChain.deployed();

        const grapesId = document.getElementById('process-grapes-id').value;
        const vintageYear = document.getElementById('process-grapes-vintage').value;
        const farmId = document.getElementById('process-farm-id').value;
        const grapesNotes = document.getElementById('process-grapes-notes').value;
  
        await supplyChain.harvestGrapes(grapesId, grapesNotes, vintageYear, farmId, {from: account});
  
        let harvestEvent = await supplyChain.GrapesHarvested()
  
        harvestEvent.watch(function(error, result) {
          if (!error) {
            console.log(result.args.farmId);
          } else {
            console.log(error);
          }
        })
      },
  
      pressGrapes : async () => {
  
        const supplyChain = await SupplyChain.deployed();
  
        const grapesId = document.getElementById('process-press-grapes-id').value;
  
        await supplyChain.pressGrapes(grapesId, {from: account});
  
        let pressEvent = await supplyChain.GrapesPressed();
  
        pressEvent.watch(function(error, result) {
          if (!error) {
            console.log(result.args.grapesId);
          } else {
            console.log(error);
          }
        })
      },
  
      fermentGrapes : async () => {
  
        const supplyChain = await SupplyChain.deployed();
  
        const grapesId = document.getElementById('process-ferment-grapes-id').value;
  
        await supplyChain.fermentGrapes(grapesId, {from: account});
  
        let fermentationEvent =  await supplyChain.GrapesFermented();
  
        fermentationEvent.watch(function(error, result) {
          if (!error) {
            console.log(result.args.grapesId);
          } else {
            console.log(error);
          }
        });
      },
  
      processWine : async () => {
  
        const supplyChain = await SupplyChain.deployed();
        
        const bottleId = document.getElementById('process-bottle-id').value;
        const grapesId = document.getElementById('process-wine-grapes-id').value;
        const price = document.getElementById('process-wine-bottle-price').value;
        const notes = document.getElementById('process-wine-notes').value;
  
        await supplyChain.bottlingWine(bottleId, grapesId, price, notes, {from: account});
  
        let processEvent = await supplyChain.WineBottled();
  
        processEvent.watch(function(error, result) {
          if (!error) {
            console.log(result.args.sku);
          } else {
            console.log(error);
          }
        });
      },
  
      buyBottleForDistribution : async () => {

        const supplyChain = await SupplyChain.deployed();
        const deployer = await supplyChain.owner.call({from: account});

        if (await !supplyChain.isDistributor(account, {from: deployer})) {
          await supplyChain.addDistributor(account, {from: deployer});
        }
  
        const bottleId = document.getElementById('process-dist-bottle-id').value;
        const bottlePrice = document.getElementById('process-dist-bottle-price').value;
  
        await supplyChain.bottleForDistributionSale(bottleId, bottlePrice, {from: account, value: web3.toWei(bottlePrice)});
        
        let distributionEvent =  await supplyChain.WineBottleForDistributionSold();
  
        distributionEvent.watch(function(error, result) {
          if (!error) {
            console.log(result.args.sku);
          } else {
            console.log(error);
          }
        });
      },
  
      buyBottleForRetail : async () => {
  
        const supplyChain = await SupplyChain.deployed();
        const deployer = await supplyChain.owner.call({from: account})
        
        if (await !supplyChain.isRetailer(account, {from: deployer})) {
          await supplyChain.addRetailer(account, {from: deployer});
        }
  
        const bottleId = document.getElementById('process-ret-bottle-id').value;
        const bottlePrice = document.getElementById('process-ret-bottle-price').value;
  
        await supplyChain.bottleShipForRetail(bottleId, bottlePrice, {from: account, value: web3.toWei(bottlePrice)});
  
        let retailEvent = await supplyChain.WineBottleRetailReceived();
  
        retailEvent.watch(function(error, result) {
          if (!error) {
            console.log(result.args.sku);
          } else {
            console.log(error);
          }
        });
      },
  
      bottleForSale : async () => {
  
        const supplyChain = await SupplyChain.deployed();
  
        const bottleId = document.getElementById('retail-sale-bottle-id').value;
        const bottlePrice = document.getElementById('retail-sale-bottle-price').value;
  
        await supplyChain.bottleForSale(bottleId, bottlePrice, {from: account});
  
        let saleEvent = await supplyChain.WineBottleForSale();
  
        saleEvent.watch(function(error, result) {
          if (!error) {
            console.log(result.args.sku);
          } else {
            console.log(error);
          }
        });
      },
  
      buyBottle : async () => {
  
        const supplyChain = await SupplyChain.deployed();
        const deployer = await supplyChain.owner.call({from: account})

        if (!(await supplyChain.isCustomer(account, {from: deployer}))) {
          await supplyChain.addCustomer(account, {from: deployer});
        }
  
        const bottleId = document.getElementById('customer-wine-bottle-id').value;
        const bottlePrice = document.getElementById('customer-wine-bottle-price').value;
  
        await supplyChain.buyBottle(bottleId, bottlePrice, {from: account, value: web3.toWei(bottlePrice)});
  
        let buyEvent = await supplyChain.WineBottleSold();
  
        buyEvent.watch(function(error, result) {
          if (!error) {
            console.log(result.args.sku);
          } else {
            console.log(error);
          }
        });
      },
  
      shipBottle : async () => {
  
        const supplyChain = await SupplyChain.deployed();
  
        const bottleId = document.getElementById('process-ship-bottle-id').value;
        
        await supplyChain.shipBottle(bottleId, {from: account});
  
        let shipEvent = await supplyChain.WineBottleShipped();
  
        shipEvent.watch(function(error, result) {
          if (!error) {
            console.log(result.args.sku);
          } else {
            console.log(error);
          }
        });
      },
  
      receivedBottle : async () => {
  
        const supplyChain = await SupplyChain.deployed();
  
        const bottleId = document.getElementById('process-mark-bottle-received').value;
  
        await supplyChain.BottleReceived(bottleId, {from: account});
  
        let receivedEvent = await supplyChain.WineBottleReceived();
  
        receivedEvent.watch(function(error, result) {
          if (!error) {
            console.log(result.args.sku);
          } else {
            console.log(error);
          }
        })
      },

      getGrapesInfo : async () => {

        const supplyChain = await SupplyChain.deployed();

        const grapesId = document.getElementById('results-grapes-info-id').value;

        const resultGrapes = await supplyChain.getFarmInfo.call(grapesId);

        document.getElementById('results-grapes-information-id').value = resultGrapes[0];
        document.getElementById('results-grapes-info-vintage').value = resultGrapes[2];
        document.getElementById('results-grapes-info-state').value = resultGrapes[3];
        document.getElementById('results-grapes-info-farmId').value = resultGrapes[4];
        document.getElementById('results-grapes-notes').value = resultGrapes[1];
        document.getElementById('results-grapes-info-name').value = resultGrapes[5];
        document.getElementById('results-farm-latitude"').value = resultGrapes[6];
        document.getElementById('results-farm-longitude').value = resultGrapes[7];
        document.getElementById('results-farm-address').value = resultGrapes[8];
      },

      getWineInfo : async () => {

        const supplyChain = await SupplyChain.deployed();

        const wineId = document.getElementById('results-wine-info-id').value;

        const resultWine = await supplyChain.getBottleInfo(wineId);

        document.getElementById('results-wine-bottle-id').value = resultWine[0];
        document.getElementById('results-wine-bottle-price').value = resultWine[1];
        document.getElementById('results-bottle-owner').value = resultWine[2];
        document.getElementById('results-bottle-buyer').value = resultWine[3];
        document.getElementById('results-wine-bottle-state').value = resultWine[4];
        document.getElementById('results-bottle-grapes-id').value = resultWine[5];
        document.getElementById('results-wine-notes').value = resultWine[6];
      }
}

window.App = App

window.addEventListener('load', async() => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
        // Request account access if needed
        await ethereum.enable();
    } catch (error) {
        // User denied account access...
    }
  } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // https://rinkeby.infura.io/v3/d530853c676f4b0e9c0b97d4fdfc8324
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
  }

  App.start()
});
    