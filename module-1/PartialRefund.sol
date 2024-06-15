// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract PartialRefund is ERC20Capped, Ownable2Step {
    uint256 public constant MAX_SUPPLY = 1000000 ether;

    constructor(
        address initialOwner
    ) ERC20("XHACKS", "XHS") ERC20Capped(MAX_SUPPLY) Ownable(initialOwner) {}

    function buyTokens() public payable {
        require(msg.value > 0, "You need to send some ether");
        uint256 tokensToMint = (msg.value * 1000 ether) / 1 ether;
        _mint(msg.sender, tokensToMint);
    }

    function withdrawEther(uint256 amount, address target) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = target.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function sellBack(uint256 amount) public {
        require(amount <= balanceOf(msg.sender), "Insufficient token balance");
        uint256 refundAmount = ((amount * 0.5 ether) / 1000 ether);
        require(
            address(this).balance >= refundAmount,
            "Insufficient contract balance"
        );

        _burn(msg.sender, (amount));
        payable(msg.sender).transfer(refundAmount);
    }
}
