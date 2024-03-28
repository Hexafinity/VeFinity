// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract VeFinity is ERC20, ERC20Burnable, Pausable {
    uint256 public constant INITIAL_SUPPLY = 6e12 * (10 ** 18); // 6 trillion tokens, accounting for 18 decimals
    address public owner;
address private constant TAX_RECEIVER = 0x35a8276Acc795618bCFeac47BE808D5a7e77ff0a;

    constructor() ERC20("VeFinity", "VeFi") {
        owner = msg.sender;
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function pause() public {
        require(msg.sender == owner, "Not the contract owner");
        _pause();
    }

    function unpause() public {
        require(msg.sender == owner, "Not the contract owner");
        _unpause();
    }

}
