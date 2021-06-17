import React, { Component } from "react";
import DiamondToken from "./contracts/DiamondToken.json";
import getWeb3 from "./getWeb3";
import DiamondTokenSale from "./contracts/DiamondTokenSale.json";
import KYC from "./contracts/Kyc.json";

import "./App.css";

class App extends Component {
  state = { loaded: false, diamondTokenSaleAddress: "", thisUserTokens: 0, kycAddress: "0x123" };

  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();
      this.accounts = await this.web3.eth.getAccounts();
      // Get the contract instance.
      //this.networkId = await this.web3.eth.net.getId(); <<- this doesn't work with MetaMask anymore
      this.networkId = await this.web3.eth.getChainId();      

      this.DiamondToken = new this.web3.eth.Contract(
        DiamondToken.abi,
        DiamondToken.networks[this.networkId] && DiamondToken.networks[this.networkId].address,
      );

      this.DiamondTokenSale = new this.web3.eth.Contract(
        DiamondTokenSale.abi,
        DiamondTokenSale.networks[this.networkId] && DiamondTokenSale.networks[this.networkId].address,
      );
      this.kyc = new this.web3.eth.Contract(
        KYC.abi,
        KYC.networks[this.networkId] && KYC.networks[this.networkId].address,
      );
      this.setState({ loaded:true });
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web service, accounts, or the smart contract.\n Please Check console for details.`,
    );
    console.error(error);
  }
  };
  // truufle console comand send ether to meta mask acc to  enable other accounts from different network.
  // web3.eth.sendTransaction({to:"matamask_acc", from: account[0], value: web3.utils.toWei("2", "ether ")});
  // truffle migrate --network ganache_local  (if network up todate --reset to overwrite)
  
  updateUserTokens = async() => {
    let _thisUserTokens = await this.diamondToken.methods.balanceOf(this.accounts[0]).call();
    this.setState({thisUserTokens: _thisUserTokens});
  }
  handleBuyToken = async () => {
    await this.diamondTokenSale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: 1});
  }
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleKycSubmit = async () => {
    const {_kycAddress} = this.state.kycAddress;
    await this.kyc.methods.setKycAccepted(_kycAddress).send({from: this.accounts[0]});
    alert("Account "+_kycAddress+" is now whitelisted.");
  }

  render() {
    if (!this.state.web3) {
      return <div> <h1>Loading service...</h1> </div>;
    }
    return (
      <div className="App">
        <h1>Royal Diamond Tokens </h1>
        <h2>Add your account to be able buy a token and Redeem your physical Royal Diamond from the store.</h2>
          Address: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleKycSubmit}>Add to Whitelist</button>
        <h2>To Buy Royal Diamond Tokens</h2>
        <p>Send Ether to this address: {this.state.tokenSaleAddress}</p>
        <p>You have: {this.state.thisUserTokens}</p>
        <button type="button" onClick={this.handleBuyToken}>Buy</button>
      </div>
    );
  }
}

export default App;
