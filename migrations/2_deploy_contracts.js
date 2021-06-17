var DiamondToken = artifacts.require("./DiamondToken.sol");
var DiamondTokenSale = artifacts.require("./DiamondTokenSale.sol");
var Kyc = artifacts.require("./Kyc.sol");
require("dotenv").config({path: "../.env"});

const amount = process.env.INITIAL_TOKENS;
module.exports = async function(deployer) {
    
    const accounts = await web3.eth.getAccounts();
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(DiamondToken, process.env.INITIAL_TOKENS );
    await deployer.deploy(Kyc);
    await deployer.deploy(DiamondTokenSale, 1, addr[0], DiamondToken.address, Kyc.address);
    let diamondToken = await DiamondToken.deployed();
    // the code below is transfering all the tokens from diamond token smart contract to the dimond crowd sale smart constract.
    await diamondToken.transfer(DiamondTokenSale.address, process.env.INITIAL_TOKENS);
};