const DiamondToken = artifacts.require("DiamondToken");
const DiamondTokenSale = artifacts.require("DiamondTokenSale");
const KYC = artifacts.require("Kyc");

require('dotenv').config({path: './.env'});
const chai = require("./setupChai.js");
const expect = chai.expect;
const BN = web3.utils.BN;

contract("DiamondSaleContract Test", async accounts =>{
    const [initialAcc, recipient, otherAcc] = accounts;

    it("There should not be any token in initial account", async()=>{
        let dti = await DiamondToken.deployed();
        return expect(dti.balanceOf(initialAcc).to.eventually.be.a.bignumber).equal(new BN(0));
    });

    it("All tokens should be in the crowdsale smart contract", async()=>{
        let dti = await DiamondToken.deployed();
        let totalSupply = await dti.totalSupply();
        let crowdsaleBalance = await dti.balanceOf(dti.address);
        expect(totalSupply.to.eventually.be.a.bignumber).equal(crowdsaleBalance);
    });

    it("Posible to buy tokens", async()=>{
        let dti = await DiamondToken.deployed();
        let totalSupply = await dti.totalSupply();
        let crowdsaleBalance = await dti.balanceOf(dti.address);
        let olderBalance = dti.balanceOf(deployer);
        expect(dti.sendTransaction({from: deployer, value: WebSocket.utils.toWei("1", "wei")})).to.be.fulfilled;
        return excpect(dti.balanceOf(initialAcc)).to.eventually.be.a.bignumber.equal(olderBalance.sub(new BN(1)));
    }); 
   
});