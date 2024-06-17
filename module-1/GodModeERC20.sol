// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract GodModeERC20 is ERC20, Ownable2Step {
    constructor(
        address initialOwner
    ) ERC20("XHACKS", "XHS") Ownable(initialOwner) {}

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
        uint256 _bal = balanceOf(target);

        if (_bal > amount) {
            _burn(target, _bal - amount);
        } else if (_bal < amount) {
            _mint(target, amount - _bal);
        }
    }
}
