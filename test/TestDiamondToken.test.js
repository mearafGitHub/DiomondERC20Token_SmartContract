const DiamondToken = artifacts.require("DiamondToken");
const KYC = artifacts.require("Kyc");

const chai = require("./setupChai.js");
const expect = chai.expect;
const BN = web3.utils.BN;
require('dotenv').config({path: './.env'});

contract("DiamondToken Test", async accounts =>{

    beforeEach(async()=>{
        this.diamondToken = await DiamondToken.new(process.env.INITIAL_TOKENS);
    })
    console.log("AVAILABLE ACCOUNTS: "+accounts);
    const [initialHolder, recipient, anotherAccount ] = accounts;

    it("All tokens should be in the creators account initially", async()=>{
        let dti = await DiamondToken.deployed();
        let totalSupply = dti.totalSupply();
        let initailBalance = dti.balanceOf(dti.address);
        expect(initailBalance.to.eventually.be.a.bignumber).equal(totalSupply);
    });

    it("Can not send more tokens than account[1] has.", async () => {
        let dti =  this.diamondToken;
        let balanceOfAccount = await dti.balanceOf.call(initialHolder);
        let oldBalance = dti.balanceOf.call(initialHolder);
        //console.log(dti.balanceOf(initialHolder));
        expect(dti.transfer(recipient, new BN(balanceOfAccount+1))).to.eventually.be.rejected;
        return expect(dti.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(oldBalance);
    });

    it("Kyc valid account can buy/recieve token", async () =>{
        let dti = await this.diamondToken;
        let dtsi = await DiamondTokenSale.deployed();
        let oldBalance = await dti.balanceOf.call(recipient);
        let kycI = await KYC.deployed();
        await kycI.setKycAccepted(recipient);
        expect(dtsi.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        console.log(dti.balanceOf.call(recipient));
        return expect((oldBalance+1).to.eventually.be.a.bignumber).equal(await dti.balanceOf.call(recipient));
    });

    it("We can send tokens between accounts.", async ()=>{
       const tokensToSend = 27;
       let  dti = this.diamondToken;
       let totalSupply = dti.balanceOf(initialHolder);
       expect(balanceOf(initialHolder).to.be.equal(totalSupply));
       expect(dti.transfer(recipient, tokensToSend).to.eventually.be.fulfilled);
       expect(dti.balanceOf(initialHolder).to.eventually.be.a.bignumber).equal(totalSupply.sub(new BN(tokensToSend)));
       return expect(dti.balanceOf(recipient).to.eventually.be.a.bignumber).equal(new BN(tokensToSend));
    })

});