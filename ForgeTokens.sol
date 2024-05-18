// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ForgeToken is ERC1155, Ownable {
    uint256 public constant TOKEN_0 = 0;
    uint256 public constant TOKEN_1 = 1;
    uint256 public constant TOKEN_2 = 2;
    uint256 public constant TOKEN_3 = 3;
    uint256 public constant TOKEN_4 = 5;
    uint256 public constant TOKEN_5 = 6;
    uint256 public constant TOKEN_6 = 7;

     constructor(address initialOwner)
        ERC1155("https://ipfs.io/ipfs/QmZuFnrvD5qChZuhq4PkDAeKtcFXN3MwMYhwWSKcdk5vW9/{id}")
        Ownable()
    {}

    mapping(uint256 => string) private _uris;

    function mint(uint256 tokenid, uint256 amount) external {
        require(
            tokenid == 0 || tokenid == 1 || tokenid == 2,
            "This token can only be forged not minted"
        );
        _mint(msg.sender, tokenid, amount, "");
    }

    function forgeToken3(uint256 tokenid, uint256 amount) external {
        require(
            (tokenid != 0 || tokenid != 1 || tokenid != 2) && tokenid == 3,
            "This token can only be minted not forged"
        );
        uint256[] memory ids = new uint256[](2);
        ids[0] = TOKEN_0;
        ids[1] = TOKEN_1;
        uint256[] memory balances = new uint256[](2);
        balances[0] =
            balanceOf(msg.sender, TOKEN_0) -
            (balanceOf(msg.sender, TOKEN_0) - amount);
        balances[1] =
            balanceOf(msg.sender, TOKEN_1) -
            (balanceOf(msg.sender, TOKEN_1) - amount);
        require(
            balances[0] >= amount && balances[1] >= amount,
            "Insufficient Tokens"
        );
        _burnBatch(msg.sender, ids, balances);
        _mint(msg.sender, tokenid, amount, "");
    }

    function forgeToken4(uint256 tokenid, uint256 amount) external {
        require(
            (tokenid != 0 || tokenid != 1 || tokenid != 2) && tokenid == 4,
            "This token can only be minted not forged"
        );
        uint256[] memory ids = new uint256[](2);
        ids[0] = TOKEN_1;
        ids[1] = TOKEN_2;
        uint256[] memory balances = new uint256[](2);
        balances[0] =
            balanceOf(msg.sender, TOKEN_1) -
            (balanceOf(msg.sender, TOKEN_1) - amount);
        balances[1] =
            balanceOf(msg.sender, TOKEN_2) -
            (balanceOf(msg.sender, TOKEN_2) - amount);
        require(
            balances[0] >= amount && balances[1] >= amount,
            "Insufficient Tokens"
        );
        _burnBatch(msg.sender, ids, balances);
        _mint(msg.sender, tokenid, amount, "");
    }

    function forgeToken5(uint256 tokenid, uint256 amount) external {
        require(
            (tokenid != 0 || tokenid != 1 || tokenid != 2) && tokenid == 5,
            "This token can only be minted not forged"
        );
        uint256[] memory ids = new uint256[](2);
        ids[0] = TOKEN_0;
        ids[1] = TOKEN_2;
        uint256[] memory balances = new uint256[](2);
        balances[0] =
            balanceOf(msg.sender, TOKEN_0) -
            (balanceOf(msg.sender, TOKEN_0) - amount);
        balances[1] =
            balanceOf(msg.sender, TOKEN_2) -
            (balanceOf(msg.sender, TOKEN_2) - amount);
        require(
            balances[0] >= amount && balances[1] >= amount,
            "Insufficient Tokens"
        );
        _burnBatch(msg.sender, ids, balances);
        _mint(msg.sender, tokenid, amount, "");
    }

    function forgeToken6(uint256 tokenid, uint256 amount) external {
        require(
            (tokenid != 0 || tokenid != 1 || tokenid != 2) && tokenid == 6,
            "This token can only be minted not forged"
        );
        uint256[] memory ids = new uint256[](3);
        ids[0] = TOKEN_0;
        ids[1] = TOKEN_1;
        ids[2] = TOKEN_2;
        uint256[] memory balances = new uint256[](3);
        balances[0] =
            balanceOf(msg.sender, TOKEN_0) -
            (balanceOf(msg.sender, TOKEN_0) - amount);
        balances[1] =
            balanceOf(msg.sender, TOKEN_1) -
            (balanceOf(msg.sender, TOKEN_1) - amount);
        balances[2] =
            balanceOf(msg.sender, TOKEN_2) -
            (balanceOf(msg.sender, TOKEN_2) - amount);
        require(
            balances[0] >= amount &&
                balances[1] >= amount &&
                balances[2] >= amount,
            "Insufficient Tokens"
        );
        _burnBatch(msg.sender, ids, balances);
        _mint(msg.sender, tokenid, amount, "");
    }

    function trade(
        address to,
        uint256 tokenid,
        uint256 amount
    ) external {
        require(
            tokenid == 0 || tokenid == 1 || tokenid == 2,
            "This token cannot be traded"
        );
        require(
            balanceOf(msg.sender, tokenid) >= amount,
            "Insufficient Tokens"
        );
        safeTransferFrom(msg.sender, to, tokenid, amount, "");
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (_uris[tokenId]);
    }

    function setTokenUri(uint256 tokenId, string memory uri)
        public
        virtual
        
    {
        require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice");
        _uris[tokenId] = uri;
    }
}
