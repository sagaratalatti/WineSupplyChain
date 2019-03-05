import Web3 from "web3";
import './styles/main.css';
import './animation/animate.css';
import harvestImage from './images/harvest.png';
i//mport metaCoinArtifact from "../../build/contracts/MetaCoin.json";



const App = {
  //web3: null,
  //account: null,
  //meta: null,
  setStatus: () => {
    var picture = document.getElementById('image-holder');
    picture.src = harvestImage;
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:9545"),
    );
  }

  App.start();
});
