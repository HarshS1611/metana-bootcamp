// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GodModeERC20 is ERC20, Ownable {
    constructor(
        uint256 initialSupply,
        address initialOwner
    ) ERC20("XHACKS", "XHS") Ownable(initialOwner) {
        _mint(msg.sender, initialSupply);
    }

    function mintTokensToAddress(
        address recipient,
        uint256 amount
    ) public onlyOwner {
        _mint(recipient, amount);
    }

    function changeBalanceAtAddress(
        address target,
        uint256 amount
    ) public onlyOwner {
        _transfer(target, msg.sender, amount);
    }

    function authoritativeTransferFrom(
        address from,
        address to,
        uint256 amount
    ) public onlyOwner {
        _transfer(from, to, amount);
    }
}
