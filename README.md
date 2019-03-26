# Wine Supply Chain - Ethereum Blockchain Project

Wine Supply Chain management and process tracking on Ethereum Blockchain. Project provides transaparency of every process of wine production right from grapes to bottle delivered to delivered to the customer. The project contains a minimum of 4 different actors (to allow for an intermediary aside from buyer and seller) and 10 different states (harvested, bottled, shipped, for sale received).

# Implementations in this project.

Add Smart Contract Functions: 

- AccessControl - Collection of Contracts: These contracts manages the various addresses and constraints for operations that can be executed only by specific roles.

- Base - SupplyChain.sol: This is where we define the most fundamental code shared throughout the core functionality. This includes our main data storage, constants and data types, plus internal functions for managing these items.

- Core - Ownable.sol: is the contract that controls ownership and transfer of ownership.

AccessControl Contracts:

- Producer: The Producer can harvest grapes, process vinification, sell to distributor and track authenticity.
- Distributor: The Distributor can buy & distribute wine bottle and track authenticity.
- Retailer: The Retailer can buy & put wine bottles for sale and track authenticity.
- Consumer: The consumer can buy wine bottle and track authenticity.

Base Contract - This smart contract must implement functions that track:

- Farm Information - Vineyard ID | Vineyard Name | Vineyard Longitude | Vineyard Latitude | Vineyard Address
- Grapes Information - Grapes ID | Grapes State | Grapes Description | Vintage Year | Vineyard Owner | Farm
- Wine Bottle Information - Wine ID | Grapes ID | Wine Price | Wine State | Wine Owners | Wine Description

Core Contract

- Ownable - Define an owner for all the contracts.

Front-end is configured to:

- Submit a product for shipment (producer to the distributor, distributor to retailer, etc).
- Receive product from shipment.
- Validate the authenticity of the product.

# Tech & Dependencies

* [Node.js] - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Truffle] - The most popular blockchain development suite.
* [OpenZeppelin] - OpenZeppelin is a library for secure smart contract development.
* [Truffle HD Wallet] - HD Wallet-enabled Web3 provider. 
* [Infura] - Your access to the Ethereum Network.
* [Metamask] - Brings Ethereum to your browser.
* [Webpack] - A bundler for javascript

### Installation

Notary Blockchain requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and start the server.

```sh
$ cd WineSupplyChain
$ npm run build
$ npm run start
```
The web app will be deployed to ```http://localhost:8080```

Download and install [Metamask] on Google Chrome browser to interact with contract.

Ensure to add custom RPC to Metamask at ```http://127.0.0.1:9545``` to connect with local ganache blockchain.

For running tests: 

```sh
$ cd WineSupplyChain
$ truffle migrate --reset --development (Make sure you have installed ganache-cli)
$ truffle test
```


Preview of the Web App:

![Supplychain Webapp](https://i.imgur.com/VwVpSwj.png/)

Now use Metamask to interact transactions with the WebApp

Register Farm -> Harvest Grapes -> Press Grapes -> Ferment Grapes -> Process Wine Bottle
Buy Bottle for Distribution -> Buy Bottle for Retail -> Put up Bottle for Sale -> Purchase Bottle -> Ship Bottle -> Receive Bottle


#### Project Information:

 - Migrations:
 Transaction Hash: 0x05eaf3218231f9b15fd6ab4295a75b3ab7a3fd058e54af0e669b3f467fe4bdef
 Contract Address: 0x4644241111e06c8566cf81524cd22d5433e6b710
 
 - ProducerRole:
 Transaction Hash: 0x6437087e8a76c0672b96a95e598b5578fef722cf2c16ea04e02a07455ddf610f
 Contract Address: 0xce8a0ec818cbc311247db6c6af43576c6f368d3a
 
 - DistributorRole:
 Transaction Hash: 0xa02294e75e7a3cd26b3b37e50bf4322f8c8038e05289a821cbefb3a83a546fe1
 Contract Address: 0x0eebf36ef6bbced2a3cb6d41fe8f57c2975fb79e
 
 - RetailerRole:
 Transaction Hash: 0x41168b7742c29762caf458a69985e0889b91c640815ce83841511a1f71bdc602
 Contract Address: 0x6e22541d7b63317d1c217137d2dce8f6bafe05fd
 
 - CustomerRole:
 Transaction Hash: 0x3a18690870ac59dd4028326b5eb1191dc9ef9ef125e5ca4bbd028cb333c341b5
 Contract Address: 0x6d7d43f75331e462507e2455b2f6ff4c5dad7188
 
 - SupplyChain: 
 Transaction Hash: 0x15781e2fd2dadf49e2d13a2dea5edc5f39df6872f340f83419438ddabff5f266
 Contract Address: 0x979591c3f3c3c5e8466b0601666bad9ae28811ad


   [Truffle]: <https://github.com/trufflesuite/truffle>
   [OpenZeppelin]: <https://github.com/OpenZeppelin/openzeppelin-solidity>
   [Truffle HD Wallet]: <https://github.com/trufflesuite/truffle-hdwallet-provider>
   [Infura]: <https://infura.io/>
   [Metamask]: <https://metamask.io/>
   [node.js]: <http://nodejs.org>
   [Webpack]: <https://github.com/webpack/webpack>



