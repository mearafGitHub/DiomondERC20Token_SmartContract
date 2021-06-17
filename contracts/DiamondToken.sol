// SPDX-License-Identifier: MIT
pragma solidity >=0.6.1 ;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract DiamondToken is Context, ERC20, ERC20Detailed {
    constructor(uint256 initialSupply) 
    public ERC20Detailed("Royal Diamond Token", "RDT") {
        _mint(_msgSender(), initialSupply);
    }
}