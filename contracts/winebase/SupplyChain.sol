pragma solidity ^0.4.24;

import ".././wineaccesscontrol/ProducerRole.sol";
import ".././wineaccesscontrol/DistributorRole.sol";
import ".././wineaccesscontrol/RetailerRole.sol";
import ".././wineaccesscontrol/CustomerRole.sol";


contract SupplyChain is ProducerRole, DistributorRole, RetailerRole, CustomerRole {

    address deployer;
    uint previousGrapesId;
    uint previousBottleId;
    uint previousFarmId;
    address emptyAddress = 0x00000000000000000000000000000000000000;

    struct Location {
        string longitude;
        string latitude;
        string locationName;
    }

    struct Farm {
        uint farmId;
        string farmName;
        Location location;
    }

    mapping (uint => Farm) farms;
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

    enum BottleState {Owned, ForSale, Sold, Shipped, Consumed}

    struct WineBottle {
        uint sku;
        Grapes grapes;
        uint price;
        BottleState bottleState;
        address buyer;
        address bottleOwner;
    }

    mapping (uint => WineBottle) bottles;
    event WineBottleOwned(uint sku);
    event WineBottleForSale(uint sku);
    event WineBottleSold(uint sku);
    event WineBottleShipped(uint sku);
    event WineBottleConsumed(uint sku);

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
        previousGrapesId = 0;
        previousBottleId = 0;
        previousFarmId = 0;
    }

    function registerFarm(string _farmName, string _locationName, string _farmLatitude, string _farmLongitude) public {
        previousFarmId = previousFarmId + 1;
        
        Location memory farmLocation;

        farmLocation.latitude = _farmLatitude;
        farmLocation.longitude = _farmLongitude;
        farmLocation.locationName = _locationName; 

        farms[previousFarmId] = Farm ({
            farmId: previousFarmId,
            farmName: _farmName,
            location: farmLocation
        });

        emit FarmRegistered(previousFarmId);
        
    }

    function harvestGrapes(string _notes, uint _vintageYear, uint farmId) public verifyCaller(deployer) {
        
        previousGrapesId = previousGrapesId + 1;
        
        grapes[previousGrapesId] = Grapes ({
            grapesId: previousGrapesId,
            notes: _notes,
            vintageYear: _vintageYear,
            farmOwner: msg.sender,
            GrapeState: GrapeState.Harvested,
            farm: farms[farmId].farmName
        });

        emit GrapesHarvested(previousGrapesId);
    }

    function pressGrapes(uint grapeId) public 
    grapesExists(grapeId) 
    verifyGrapesState(grapeId, GrapeState.Harvested) 
    verifyCaller(grapes[grapeId].farmOwner) {

        grapes[grapeId].state = GrapeState.Pressed;
        
        emit GrapesPressed(grapeId);
    }

    function fermentGrapes(uint grapeId) public 
    grapesExists(grapeId) 
    verifyGrapesState(grapeId, GrapeState.Pressed) 
    verifyCaller(grapes[grapeId].farmOwner) {

        grapes[grapeId].state = GrapeState.Fermented;
        
        emit GrapesFermented(grapeId);
    }

    function getGrapesInfo(uint grapeId) public view
    returns (uint grapesId, 
             string notes,
             uint vintageYear,
             string state,
             uint farmId,
             string farmName,
             string farmLatitude,
             string farmLongitude,
             string farmLocationName) {

        grapesId = grapeId;
        notes = grapes[grapeId].notes;
        vintageYear = grapes[grapeId].vintageYear;
        
        if(uint(grapes[grapeId].state) == 0) {
            state = "Harvested";
        }
        if(uint(grapes[grapeId].state) == 0) {
            state = "Pressed";
        }
        if(uint(grapes[grapeId].state) == 0) {
            state = "Fermented";
        }

        farmId = grapes[grapeId].farm.farmId;
        farmName = grapes[grapeId].farm.farmName;
        farmLatitude = grapes[grapeId].farm.location.latitude;
        farmLongitude = grapes[grapeId].farm.location.longitude;
        farmLocationName = grapes[grapeId].farm.location.locationName;

    }

    function bottlingWine(uint grapeId) public
    grapesExists(grapeId)
    verifyGrapesState(grapeId, GrapeState.Fermented)
    verifyCaller(grapes[grapeId].farmOwner) {
        
        previousBottleId = previousBottleId + 1;
        bottles[previousBottleId] = WineBottle({
            sku: previousBottleId,
            grapes: grapes[grapeId],
            price: 0,
            bottleState: BottleState.Owned,
            buyer: emptyAddress,
            owner: msg.sender
        });

        emit WineBottleOwned(bottles[previousBottleId].sku);
    }

    function bottleForSale(uint sku, uint price) public
    wineBottleExists(sku)
    verifyBottleState(sku, BottleState.Owned)
    verifyCaller(bottles[sku].bottleOwner) {

        bottles[sku].price = price;
        bottles[sku].bottleState = BottleState.ForSale;
        
        emit WineBottleForSale(sku);
    }

    function buyBottle(uint sku) public payable
    wineBottleExists(sku)
    verifyBottleState(sku, BottleState.ForSale)
    isPaidEnough(bottles[sku].price)
    returnExcessChange(sku) {

        bottles[sku].buyer = msg.sender;
        bottles[sku].bottleState = BottleState.Sold;
        bottles[sku].bottleOwner.transfer(bottles[sku].price);

        emit WineBottleSold(sku);
    }

    function shipBottle(uint sku) public
    wineBottleExists(sku)
    verifyBottleState(sku, BottleState.Sold)
    verifyCaller(bottles[sku].bottleOwner) {

        bottles[sku].bottleState = BottleState.Shipped;

        emit WineBottleShipped(sku);
    }

    function BottleReceived(uint sku) public
    wineBottleExists(sku)
    verifyBottleState(sku, BottleState.Shipped)
    verifyCaller(bottles[sku].buyer) {

        bottles[sku].bottleOwner = bottles[sku].buyer;
        bottles[sku].buyer = emptyAddress;
        bottles[sku].bottleState = BottleState.Owned;

        emit WineBottleOwned(sku);
    }

    function getBottleInfo(uint _sku) public view 
    wineBottleExists(_sku)
    returns (uint sku, uint price, address owner, address buyer, string state, uint grapeId) {
        sku = _sku;
        price = bottles[_sku].price;
        owner = bottles[_sku].bottleOwner;
        buyer = bottles[_sku].buyer;
        grapeId = bottles[_sku].grapes.grapesId;

        if(uint(bottles[_sku].bottleState) == 0) {
            state = "Owned";
        }
        if(uint(bottles[_sku].bottleState) == 1) {
            state = "For Sale";
        }
        if(uint(bottles[_sku].bottleState) == 2) {
            state = "Sold";
        }
        if(uint(bottles[_sku].bottleState) == 3) {
            state = "Shipped";
        }
        if(uint(bottles[_sku].bottleState) == 4) {
            state = "Consumed";
        }
        
    }

}