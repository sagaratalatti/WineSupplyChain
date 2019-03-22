const contract = require('truffle-contract');

const supplyChain_artifact = require('../../build/contracts/SupplyChain.json');
var SupplyChain = contract(supplyChain_artifact);

var producerId;
var distributorId;
var retailerId;
var customerId;

module.exports = {
    start: function(callback) {
        var self = this;

        SupplyChain.setProvider(self.web3.currentProvider);

        self.web3.eth.getAccounts(function(error, accounts) {
            if (error != null) {
                alert("There was an error fetching")
                return;
            }

            if (accounts.length === 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }

            self.account = accounts;
            self.producerId = self.account[1];
            self.distributorId = self.account[2];
            self.retailerId = self.account[3];
            self.customerId = self.account[4];

            callback(self.accounts);
        });

        SupplyChain.addProducer(producerId, {from: producerId});
        SupplyChain.addDistributor(distributorId, {from: distributorId});
        SupplyChain.addRetailer(retailerId, {from: retailerId});
        SupplyChain.addCustomer(customerId, {from: customerId});
    },

    registerFarm : function(producerId, vineyardName, vineyardLatitude, vineyardLongitude, vineyardAddress, callback) {
        var self = this;

        SupplyChain.setProvider(self.web3.currentProvider);

        var supplyChain;

        SupplyChain.deployed().then(function(instance) {
            supplyChain = instance;
            return supplyChain.registerFarm(vineyardName, vineyardLatitude, vineyardLongitude, vineyardAddress, {from: producerId});
        }).then(function(value) {
            callback(value.valueOf());
        }).catch(function (error) {
            console.log(error);
            callback("Error 404");
        });
    },
}