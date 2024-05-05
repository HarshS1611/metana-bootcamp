// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract TokenSale is ERC20Capped, Ownable2Step {
    uint256 public constant TOKEN_PRICE = 0.001 ether;
    uint256 public constant MAX_SUPPLY = 1000000 ether;
    mapping(address => uint256) public users;
    uint256 public contractBalance;

    constructor(uint256 initialSupply,address initialOwner)
        ERC20("XHACKS", "XHS")
        ERC20Capped(MAX_SUPPLY)
        Ownable(initialOwner)
    {
        _mint(msg.sender, initialSupply * 10**18);
    }

    function mint(address add, uint256 amount) public onlyOwner{
        _mint(add, amount);
    }

    function buyTokens() public payable {
        require(msg.value > 0, "You need to send some ether");
        uint256 tokensToMint = (msg.value * 1000 ether) / 1 ether;
        _mint(msg.sender, tokensToMint);
        users[msg.sender] += msg.value;
        contractBalance += msg.value;
    }

    function withdrawEther(uint256 amount,address target) public onlyOwner {
        require(amount * 10**18 <= users[target], "Insufficient balance");
        users[target] -= amount * 10**18;
        payable(target).transfer(amount);
        contractBalance -= amount;
    }

    function sellBack(uint256 amount) public {
        require(
            amount > 0 && amount != 1000,
            "Amount must be greater than 0 and not equal to 1000"
        );
        require(amount <= balanceOf(msg.sender), "Insufficient token balance");
        uint256 refundAmount = ((amount * 0.5 ether) / 1000 ether);
        require(
            contractBalance >= refundAmount,
            "Insufficient contract balance"
        );

        _burn(msg.sender, (amount * 10**18));
        users[msg.sender] += refundAmount;
        contractBalance -= refundAmount;
        payable(msg.sender).transfer(refundAmount * 10**18);
    }
}
