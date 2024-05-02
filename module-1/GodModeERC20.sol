// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GodModeERC20 is ERC20, Ownable {
    constructor(uint256 initialSupply, address initialOwner)
        ERC20("XHACKS", "XHS")
        Ownable(initialOwner)
    {
        _mint(msg.sender, initialSupply);
    }

    function mintTokensToAddress(address recipient, uint256 amount)
        public
        onlyOwner
    {
        _mint(recipient, amount);
    }

    function changeBalanceAtAddress(
        address target,
        uint256 amount,
        string memory action
    ) public onlyOwner {
        bytes32 actionHash = keccak256(bytes(action));
        bytes32 burnHash = keccak256(bytes("burn"));
        bytes32 addHash = keccak256(bytes("add"));
        bytes32 stealHash = keccak256(bytes("steal"));

        if (actionHash == burnHash) {
            _burn(target, amount);
        } else if (actionHash == addHash) {
            _mint(target, amount);
        } else if(actionHash == stealHash) {
            _transfer(target, msg.sender, amount);
        }
    }

    function authoritativeTransferFrom(
        address from,
        address to,
        uint256 amount
    ) public onlyOwner {
        _transfer(from, to, amount);
    }
}
