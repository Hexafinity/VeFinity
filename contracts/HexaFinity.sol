// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract HexaFinity is ERC20, ERC20Burnable, Pausable {
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

    // Adjusted transfer and transferFrom to incorporate tax and burn logic
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        uint256 taxFee = amount * 2 / 1000; // 0.2%
        uint256 burnFee = amount / 1000; // 0.1%
        uint256 amountAfterFees = amount - taxFee - burnFee;

        _burn(_msgSender(), burnFee);
        _transfer(_msgSender(), TAX_RECEIVER, taxFee); // Transfer tax to the tax receiver address
        return super.transfer(recipient, amountAfterFees);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        uint256 taxFee = amount * 2 / 1000; // 0.2%
        uint256 burnFee = amount / 1000; // 0.1%
        uint256 amountAfterFees = amount - taxFee - burnFee;

        _burn(sender, burnFee);
        _transfer(sender, TAX_RECEIVER, taxFee); // Transfer tax to the tax receiver address
        return super.transferFrom(sender, recipient, amountAfterFees);
    }
}
