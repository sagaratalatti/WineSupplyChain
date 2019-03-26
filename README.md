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

 - ERC-721 Token Name: SE7EN
 - ERC-721 Token Symbol: SVEN
 - Token Address on the rinkeby Network: 0x832bBB9E3d4615DADAf5D434a04C7A6C3A2DA169


   [Truffle]: <https://github.com/trufflesuite/truffle>
   [OpenZeppelin]: <https://github.com/OpenZeppelin/openzeppelin-solidity>
   [Truffle HD Wallet]: <https://github.com/trufflesuite/truffle-hdwallet-provider>
   [Infura]: <https://infura.io/>
   [Metamask]: <https://metamask.io/>
   [node.js]: <http://nodejs.org>
   [Webpack]: <https://github.com/webpack/webpack>



