// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SanctionedERC20 is ERC20, Ownable {
    mapping(address => bool) public sanctionedAddresses;

    constructor(uint256 initialSupply, address initialOwner)
        ERC20("XHACKS", "XHS")
        Ownable(initialOwner)
    {
        _mint(msg.sender, initialSupply);
    }

    function addToSanctionList(address account)
        public
        onlyOwner
    {
        require(!sanctionedAddresses[account], "Sanctioned address");
        sanctionedAddresses[account] = true;
    }

    function removeFromSanctionList(address account)
        public
        onlyOwner
    {
        require(sanctionedAddresses[account], "Not a Sanctioned address");
        sanctionedAddresses[account] = false;
    }

    function authoritativeTransferFrom(
        address from,
        address to,
        uint256 amount
    ) public onlyOwner {
        require(
            sanctionedAddresses[from] && sanctionedAddresses[to],
            "Not a Sanctioned address"
        );
        _transfer(from, to, amount);
    }
}
