// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract SanctionedERC20 is ERC20, Ownable2Step {
    mapping(address => bool) public sanctionedAddresses;

    constructor(
        uint256 initialSupply,
        address initialOwner
    ) ERC20("XHACKS", "XHS") Ownable(initialOwner) {
        _mint(msg.sender, initialSupply);
    }

    function addToSanctionList(address account) public onlyOwner {
        require(!sanctionedAddresses[account], "Already sanctioned");
        sanctionedAddresses[account] = true;
    }

    function removeFromSanctionList(address account) public onlyOwner {
        require(sanctionedAddresses[account], "Not sanctioned");
        sanctionedAddresses[account] = false;
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        if (from != address(0)) {
            require(sanctionedAddresses[from], "Not Sanctioned address");
        }
        if (from == address(0) || to == address(0)) {
            require(
                !sanctionedAddresses[to] || !sanctionedAddresses[from],
                "Sanctioned address"
            );
        }
        super._update(from, to, value);
    }
}