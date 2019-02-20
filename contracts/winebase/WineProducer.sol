pragma solidity ^0.4.24;

import ".././wineaccesscontrol/ProducerRole.sol";
import "./SupplyChain.sol";

contract WineProducer is SupplyChain, ProducerRole {

    address producerAddress;

    constructor () public {

        producerAddress = msg.sender;

        if (!isProducer(producerAddress)) {
            addProducer(producerAddress);
        }
    }

    function harvestGrapes(uint upc, address producerID, string producerName, string producerInformation, string producerLatitude, string producerLongitude, string grapesNotes) public {
        
        if (isProducer(msg.sender)) {
            harvestItem(upc, producerID, producerName, producerInformation, producerLatitude, producerLongitude, grapesNotes);
        }
    }

    function processWine(uint upc) public {

        if (isProducer(msg.sender)) {
            processItem(upc);
        }
    }

    function packWineBottles(uint upc) public {

        if (isProducer(msg.sender)) {
            packItem(upc);
        }
    }

    function sellWineBottles(uint upc, uint price) public {

        if (isProducer(msg.sender)) {
            sellItem(upc, price);
        }
    }

}