// SPDX-License-Identifier: MIT
pragma solidity >=0.6.1;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";

contract DiamondTokenSale is Crowdsale {
    Kyc kyc;
    constructor(uint256 rate, address payable wallet, IERC20 token, Kyc _kyc)
    public Crowdsale(rate, wallet, token)   {  
        kyc = _kyc;  
        // -> rate is 1 wei for 1 diamond-token 
       _preValidatePurchase(wallet, rate);
    }

    function _preValidatePurchase(address payable beneficiary, uint256 weiAmount) internal view {
    super._preValidatePurchase(beneficiary, weiAmount);
    require(kyc.kycCompleted(beneficiary), "Kyc not completed yet, aborting");
    }

}