// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract TokenSale is ERC20Capped, Ownable2Step {
    uint256 public constant TOKENS_PER_ETHER = 1000 ether;
    uint256 public constant MAX_SUPPLY = 1000000 ether;
    mapping(address => uint256) public users;

    constructor(
        uint256 initialSupply,
        address initialOwner
    ) ERC20("XHACKS", "XHS") ERC20Capped(MAX_SUPPLY) Ownable(initialOwner) {}

    function buyTokens() public payable {
        require(msg.value > 0, "You need to send some ether");
        uint256 tokensToMint = ((msg.value * TOKENS_PER_ETHER) / 1 ether);
        _mint(msg.sender, tokensToMint);
    }

    function withdrawEther(uint256 amount, address target) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = target.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
