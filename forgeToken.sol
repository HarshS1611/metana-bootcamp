// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract GameItems is ERC1155 {
    uint256 public constant TOKEN_0 = 0;
    uint256 public constant TOKEN_1 = 1;
    uint256 public constant TOKEN_2 = 2;
    uint256 public constant TOKEN_3 = 3;
    uint256 public constant TOKEN_4 = 5;
    uint256 public constant TOKEN_5 = 6;
    uint256 public constant TOKEN_6 = 7;

    mapping(address => uint256) public users;

    constructor()
        ERC1155("ipfs://QmUhvx74Xtepfoz3RbtftcEiWzaWDP2P3KhNTo8GvMEui4/{id}")
    {}

    function mint(uint256 tokenid, uint256 amount) external {
        require(
            tokenid == 0 || tokenid == 1 || tokenid == 2,
            "This token can only be forged not minted"
        );
        _mint(msg.sender, tokenid, amount, "");
        users[msg.sender] = tokenid;
    }

    function forgeToken3(uint256 tokenid, uint256 amount) external {
        require(
            tokenid != 0 || tokenid != 1 || tokenid != 2,
            "This token can only be minted not forged"
        );
        uint256[] memory ids = new uint256[](2);
        ids[0] = TOKEN_0;
        ids[1] = TOKEN_1;
        uint256[] memory balances = new uint256[](2);
        balances[0] = balanceOf(msg.sender, TOKEN_0);
        balances[1] = balanceOf(msg.sender, TOKEN_1);
        require(
            balances[0] >= amount && balances[1] >= amount,
            "Insufficient Tokens"
        );
        _burnBatch(msg.sender, ids, balances);
        _mint(msg.sender, tokenid, amount, "");
        users[msg.sender] = tokenid;
    }

    function forgeToken4(uint256 tokenid, uint256 amount) external {
        require(
            tokenid != 0 || tokenid != 1 || tokenid != 2,
            "This token can only be minted not forged"
        );
        uint256[] memory ids = new uint256[](2);
        ids[0] = TOKEN_1;
        ids[1] = TOKEN_2;
        uint256[] memory balances = new uint256[](2);
        balances[0] = balanceOf(msg.sender, TOKEN_1);
        balances[1] = balanceOf(msg.sender, TOKEN_2);
        require(
            balances[0] >= amount && balances[1] >= amount,
            "Insufficient Tokens"
        );
        _burnBatch(msg.sender, ids, balances);
        users[msg.sender] = tokenid;
    }

    function forgeToken5(uint256 tokenid, uint256 amount) external {
        require(
            tokenid != 0 || tokenid != 1 || tokenid != 2,
            "This token can only be minted not forged"
        );
        uint256[] memory ids = new uint256[](2);
        ids[0] = TOKEN_0;
        ids[1] = TOKEN_2;
        uint256[] memory balances = new uint256[](2);
        balances[0] = balanceOf(msg.sender, TOKEN_0);
        balances[1] = balanceOf(msg.sender, TOKEN_2);
        require(
            balances[0] >= amount && balances[1] >= amount,
            "Insufficient Tokens"
        );
        _burnBatch(msg.sender, ids, balances);
        users[msg.sender] = tokenid;
    }

    function forgeToken6(uint256 tokenid, uint256 amount) external {
        require(
            tokenid != 0 || tokenid != 1 || tokenid != 2,
            "This token can only be minted not forged"
        );
        uint256[] memory ids = new uint256[](3);
        ids[0] = TOKEN_0;
        ids[1] = TOKEN_1;
        ids[2] = TOKEN_2;
        uint256[] memory balances = new uint256[](3);
        balances[0] = balanceOf(msg.sender, TOKEN_0);
        balances[1] = balanceOf(msg.sender, TOKEN_1);
        balances[2] = balanceOf(msg.sender, TOKEN_2);
        require(
            balances[0] >= amount &&
                balances[1] >= amount &&
                balances[2] >= amount,
            "Insufficient Tokens"
        );
        _burnBatch(msg.sender, ids, balances);
        users[msg.sender] = tokenid;
    }
}
