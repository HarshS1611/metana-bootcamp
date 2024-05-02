// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenSale is ERC20 {
    uint256 public constant TOKEN_PRICE = 0.001 ether;
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; 
    mapping(address => uint256) public users;

    constructor(uint256 initialSupply) ERC20("XHACKS", "XHS") {
        _mint(msg.sender, initialSupply * 10**18);
    }

    function buyTokens() public payable {
        require(msg.value > 0, "You need to send some ether");
        uint256 tokensToMint = (msg.value / TOKEN_PRICE) * 10**18;
        require(totalSupply() + tokensToMint <= MAX_SUPPLY, "Maximum supply exceeded");
        _mint(msg.sender, tokensToMint);
        uint totalsupply = totalSupply();
        totalsupply += tokensToMint;
        users[msg.sender] += msg.value;
    }

    function withdrawEther(uint256 amount) public {
        require(amount * 10**18 <= users[msg.sender], "Insufficient balance");
        users[msg.sender] -= amount * 10**18;
        payable(msg.sender).transfer(amount* 10**18);
    }
}