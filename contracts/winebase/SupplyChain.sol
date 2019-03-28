pragma solidity ^0.4.24;

import ".././wineaccesscontrol/ProducerRole.sol";
import ".././wineaccesscontrol/DistributorRole.sol";
import ".././wineaccesscontrol/RetailerRole.sol";
import ".././wineaccesscontrol/CustomerRole.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract SupplyChain is ProducerRole, DistributorRole, RetailerRole, CustomerRole, Ownable {

    address deployer;
    address emptyAddress = 0x00000000000000000000000000000000000000;

    struct Location {
        string latitude;
        string longitude;
        string locationAddress;
    }

    struct Farm {
        uint farmId;
        string farmName;
        Location location;
    }

    mapping (uint => Farm) farms;
    mapping (uint => Location) farmLocation;
    event FarmRegistered(uint farmId);

    enum GrapeState {Harvested, Pressed, Fermented}

    struct Grapes {
        uint grapesId;
        string notes;
        uint vintageYear;
        address farmOwner;
        GrapeState state;
        Farm farm;
    }

    mapping (uint => Grapes) grapes;
    event GrapesHarvested(uint grapesId);
    event GrapesPressed(uint grapesId);
    event GrapesFermented(uint grapesId);

    enum BottleState {Bottled, ForDistributionSold, ShippedRetail, ForSale,  Sold, Shipped, Received, Consumed}

    struct WineBottle {
        uint sku;
        Grapes grapes;
        uint price;
        BottleState bottleState;
        address buyer;
        address bottleOwner;
        string wineNotes;
    }

    mapping (uint => WineBottle) bottles;
    event WineBottled(uint sku);
    event WineBottleForDistributionSold(uint sku);
    event WineBottleShippedRetail(uint sku);
    event WineBottleForSale(uint sku);
    event WineBottleSold(uint sku);
    event WineBottleShipped(uint sku);
    event WineBottleReceived(uint sku);

    modifier verifyCaller(address _address) {
        require(msg.sender == _address, "Caller cannot be verified!");
        _;
    }

    modifier grapesExists(uint grapesId) {
        require(grapes[grapesId].grapesId > 0, "Grapes doesn't exist!");
        _;
    }

    modifier verifyGrapesState(uint _grapesId, GrapeState state) {
        require(grapes[_grapesId].state == state, "Grapes state cannot be verified!");
        _;
    }

    modifier wineBottleExists(uint sku) {
        require(bottles[sku].sku > 0, "Wine Bottle doesn't exist!");
        _;
    }

    modifier verifyBottleState(uint sku, BottleState bottleState) {
        require(bottles[sku].bottleState == bottleState, "Wine Bottle State cannot be verified!");
        _;
    }

    modifier isPaidEnough(uint price) {
        require(msg.value >= price, "Not paid enough");
        _;
    }

    modifier returnExcessChange(uint sku) {
        _;
        uint price = bottles[sku].price;
        uint excessChange = msg.value - price;
        bottles[sku].buyer.transfer(excessChange);
    }

    constructor() public {
        deployer = msg.sender;
    }

    
    function kill() public onlyOwner {
        if (msg.sender == deployer) {
            selfdestruct(deployer);
        }
    }

    function registerFarm(uint farmId, string _farmName, string _farmLatitude, string _farmLongitude, string _locationAddress) public {
        


        Location storage newLocation = farmLocation[farmId];
        newLocation.latitude = _farmLatitude;
        newLocation.longitude = _farmLongitude;
        newLocation.locationAddress = _locationAddress;

        Farm storage newFarm = farms[farmId];
        newFarm.farmId = farmId;
        newFarm.farmName = _farmName;
        newFarm.location = newLocation;

        emit FarmRegistered(farmId);
        
    }

    function getFarmInfo(uint _farmId) public view 
    returns (uint farmId, string farmName, string latitude, string longitude, string locationAddress) {
        Farm storage returnFarm = farms[_farmId];
        farmId = returnFarm.farmId;
        farmName = returnFarm.farmName;
        latitude = returnFarm.location.latitude;
        longitude = returnFarm.location.longitude;
        locationAddress = returnFarm.location.locationAddress;
    }

    function harvestGrapes(uint grapesId, string _notes, uint _vintageYear, uint farmId) public onlyProducer {

        Grapes storage newGrapes = grapes[grapesId];
        newGrapes.grapesId = grapesId;
        newGrapes.notes = _notes;
        newGrapes.vintageYear = _vintageYear;
        newGrapes.farmOwner = msg.sender;
        newGrapes.state = GrapeState.Harvested;
        newGrapes.farm = farms[farmId];

        emit GrapesHarvested(grapesId);
    }

    function pressGrapes(uint grapeId) public 
    grapesExists(grapeId) 
    verifyGrapesState(grapeId, GrapeState.Harvested) 
    verifyCaller(grapes[grapeId].farmOwner)
    onlyProducer {

        grapes[grapeId].state = GrapeState.Pressed;
        
        emit GrapesPressed(grapeId);
    }

    function fermentGrapes(uint grapeId) public 
    grapesExists(grapeId) 
    verifyGrapesState(grapeId, GrapeState.Pressed) 
    verifyCaller(grapes[grapeId].farmOwner)
    onlyProducer {

        grapes[grapeId].state = GrapeState.Fermented;
        
        emit GrapesFermented(grapeId);
    }

    function getGrapesInfo(uint grapeId) public view
    returns (uint grapesId, //0
             string notes, //1
             uint vintageYear, //2
             string state, //3
             uint farmId, //4
             string farmName, //5
             string farmLatitude, //6
             string farmLongitude, //7
             string farmLocationAddress) {

        grapesId = grapeId;
        notes = grapes[grapeId].notes;
        vintageYear = grapes[grapeId].vintageYear;
        if (uint(grapes[grapeId].state) == 0) {
            state = "Grapes Harvested";
        } 
        if (uint(grapes[grapeId].state) == 1) {
            state = "Grapes Pressed";
        } 
        if (uint(grapes[grapeId].state) == 2) {
            state = "Grapes Fermented";
        }
        farmId = grapes[grapeId].farm.farmId;
        farmName = grapes[grapeId].farm.farmName;
        farmLatitude = grapes[grapeId].farm.location.latitude;
        farmLongitude = grapes[grapeId].farm.location.longitude;
        farmLocationAddress = grapes[grapeId].farm.location.locationAddress;
    }

    function bottlingWine(uint bottleId, uint grapeId, uint _price, string notes) public
    grapesExists(grapeId)
    verifyGrapesState(grapeId, GrapeState.Fermented)
    verifyCaller(grapes[grapeId].farmOwner)
    onlyProducer {

        WineBottle storage newBottle = bottles[bottleId];
        newBottle.sku = bottleId;
        newBottle.grapes = grapes[grapeId];
        newBottle.price = _price;
        newBottle.bottleState = BottleState.Bottled;
        newBottle.buyer = emptyAddress;
        newBottle.bottleOwner = msg.sender;
        newBottle.wineNotes = notes;

        emit WineBottled(bottles[bottleId].sku);
    }

    function bottleForDistributionSale(uint sku, uint _price) public payable
    wineBottleExists(sku)
    verifyBottleState(sku, BottleState.Bottled)
    isPaidEnough(_price)
    returnExcessChange(sku)
    onlyDistributor {

        address distributor = msg.sender;
        
        bottles[sku].buyer = distributor;
        bottles[sku].bottleOwner.transfer(_price);
        bottles[sku].bottleOwner = distributor;
        bottles[sku].bottleState = BottleState.ForDistributionSold;

        emit WineBottleForDistributionSold(sku);
    }

    function bottleShipForRetail(uint sku, uint _price) public payable
    wineBottleExists(sku)
    verifyBottleState(sku, BottleState.ForDistributionSold)
    isPaidEnough(_price)
    returnExcessChange(sku)
    onlyRetailer {

        address retailer = msg.sender;

        bottles[sku].buyer = msg.sender;
        bottles[sku].bottleOwner.transfer(_price);
        bottles[sku].bottleOwner = retailer;
        bottles[sku].bottleState = BottleState.ShippedRetail;
    }

    function bottleForSale(uint sku, uint price) public
    wineBottleExists(sku)
    verifyBottleState(sku, BottleState.ShippedRetail)
    verifyCaller(bottles[sku].bottleOwner)
    onlyRetailer {

        bottles[sku].price = price;
        bottles[sku].bottleState = BottleState.ForSale;
        
        emit WineBottleForSale(sku);
    }

    function buyBottle(uint sku) public payable
    wineBottleExists(sku)
    verifyBottleState(sku, BottleState.ForSale)
    isPaidEnough(bottles[sku].price)
    returnExcessChange(sku)
    onlyCustomer {

        bottles[sku].buyer = msg.sender;
        bottles[sku].bottleState = BottleState.Sold;
        bottles[sku].bottleOwner.transfer(bottles[sku].price);

        emit WineBottleSold(sku);
    }

    function shipBottle(uint sku) public
    wineBottleExists(sku)
    verifyBottleState(sku, BottleState.Sold)
    verifyCaller(bottles[sku].bottleOwner)
    onlyRetailer {

        bottles[sku].bottleState = BottleState.Shipped;

        emit WineBottleShipped(sku);
    }

    function BottleReceived(uint sku) public
    wineBottleExists(sku)
    verifyBottleState(sku, BottleState.Shipped)
    verifyCaller(bottles[sku].buyer)
    onlyCustomer {

        bottles[sku].bottleOwner = bottles[sku].buyer;
        bottles[sku].buyer = emptyAddress;
        bottles[sku].bottleState = BottleState.Received;

        emit WineBottleReceived(sku);
    }

    function getBottleInfo(uint _sku) public view 
    wineBottleExists(_sku)
    returns (uint sku, uint price, address owner, address buyer, string state, uint grapeId, string notes) {
        sku = _sku;
        price = bottles[_sku].price;
        owner = bottles[_sku].bottleOwner;
        buyer = bottles[_sku].buyer;

        if(uint(bottles[_sku].bottleState) == 0) {
            state = "Wine Bottled";
        }
        if(uint(bottles[_sku].bottleState) == 1) {
            state = "Wine Bottle sold for Distribution";
        }
        if(uint(bottles[_sku].bottleState) == 2) {
            state = "Wine Shipped to Retailer";
        }
        if(uint(bottles[_sku].bottleState) == 3) {
            state = "Wine Bottle for Sale with Retailer";
        }
        if(uint(bottles[_sku].bottleState) == 4) {
            state = "Wine Bottle Sold to Consumer";
        }
        if(uint(bottles[_sku].bottleState) == 5) {
            state = "Wine Bottle Shipped to Consumer";
        }
        if(uint(bottles[_sku].bottleState) == 6) {
            state = "Wine Bottle Received by Consumer";
        }

        grapeId = bottles[_sku].grapes.grapesId;
        notes = bottles[_sku].wineNotes;
        
    }

}