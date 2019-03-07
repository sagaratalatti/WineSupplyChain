var FarmerRole = artifacts.require("../contracts/wineaccesscontrol/ProducerRole.sol");
var DistributorRole = artifacts.require("../contracts/wineaccesscontrol/DistributorRole.sol");
var RetailerRole = artifacts.require("../contracts/wineaccesscontrol/RetailerRole.sol");
var CustomerRole = artifacts.require("../contracts/wineaccesscontrol/CustomerRole.sol");
var SupplyChain = artifacts.require("../contracts/winebase//SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(FarmerRole);
  deployer.deploy(DistributorRole);
  deployer.deploy(RetailerRole);
  deployer.deploy(CustomerRole);
  deployer.deploy(SupplyChain);
};
