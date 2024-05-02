// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PartialRefund is ERC20 {
    uint256 public constant TOKEN_PRICE = 0.001 ether; // 1 ETH = 1000 tokens
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 million tokens with 18 decimals
    mapping(address => uint256) public users;
    uint256 public contractBalance;

    constructor(uint256 initialSupply) ERC20("XHACKS", "XHS") {
        _mint(msg.sender, initialSupply * 10**18); // Initialize with 18 decimals
    }

    function mint(address add, uint256 amount) public {
        _mint(add, amount);
    }

    function buyTokens() public payable {
        require(msg.value > 0, "You need to send some ether");
        uint256 tokensToMint = (msg.value / TOKEN_PRICE) * 10**18;
        require(
            totalSupply() + tokensToMint <= MAX_SUPPLY,
            "Maximum supply exceeded"
        );
        _mint(msg.sender, tokensToMint);
        uint256 totalsupply = totalSupply();
        totalsupply += tokensToMint;
        users[msg.sender] += msg.value;
        contractBalance += msg.value;
    }

    function withdrawEther(uint256 amount) public {
        require(amount * 10**18 <= users[msg.sender], "Insufficient balance");
        users[msg.sender] -= amount * 10**18;
        payable(msg.sender).transfer(amount);
        contractBalance -= amount;
    }

    function sellBack(uint256 amount) public {
        require(amount > 0 && amount != 1000, "Amount must be greater than 0 and not equal to 1000");
        require(amount <= balanceOf(msg.sender), "Insufficient token balance");
        uint256 refundAmount = (amount / 1000) * 0.5 ether;
        require(
            contractBalance >= refundAmount,
            "Insufficient contract balance"
        );

        _burn(msg.sender, (amount * 10**18));
        uint256 totalsupply = totalSupply();
        totalsupply -=  (amount * 10**18);
        users[msg.sender] += refundAmount;
        contractBalance -= refundAmount;
        payable(msg.sender).transfer(refundAmount);
    }
}
