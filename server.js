const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./app/src/app.js');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static('./app/src/public/html'));

app.post('/registerFarm', (req, res) => {
    console.log("**** GET /getFarmInfo ****");
    console.log(req.body);
    let producerId = req.body.currentAcount;
    let farmName = req.body.vineyardName;
    let latitude = req.body.vineyardLatitude;
    let longitude = req.body.vineyardLonigtude;
    let address = req.body.vineyardAddress;
  
    truffle_connect.refreshBalance(producerId, farmName, latitude, longitude, address, (answer) => {
      let farm = answer;
      truffle_connect.start(function(answer){
        // get list of all accounts and send it along with the response
        let accounts = answer;
        response = [farm, accounts]
        res.send(response);
      });
    });
  });

  app.listen(port, () => {
    truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    console.log("Express Listening at http://localhost:" + port);  
  });