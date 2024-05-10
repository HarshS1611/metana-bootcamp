// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ERC20Token is ERC20 {
    constructor(uint256 initialSupply) ERC20("XHACKS", "XHS") {
        _mint(msg.sender, initialSupply);
    }
}

contract ERC721Token is ERC721 {
    uint256 public totalSupply;

    constructor() ERC721("MyERC721", "M721") {}

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }
}

contract NFTMinter is IERC721Receiver {
    ERC20Token public erc20Token;
    ERC721Token public erc721Token;
    uint256 public tokenid;
    mapping (uint => address) public OriginalOnwers;
    mapping (uint => address) public stakedOwners;


    constructor(ERC20Token _erc20Token, ERC721Token _erc721Token) {
        erc20Token = _erc20Token;
        erc721Token = _erc721Token;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function StakeNFT(uint256 tokenId) external {
        require(
            erc721Token.ownerOf(tokenId) == msg.sender,
            "NFT not found"
        );

        erc20Token.transferFrom(msg.sender, address(this),tokenId);
        stakedOwners[tokenId] = msg.sender;
        OriginalOnwers[tokenid] = msg.sender;
        tokenid++;
    }
    
  function withdrawNFT(uint tokenId) external {
    require(stakedOwners[tokenId] == erc721Token.ownerOf(tokenId), "Staked NFT not found");
    require(OriginalOnwers[tokenId] == msg.sender, "Only original owner can withdraw NFT");
    
    erc20Token.transferFrom(address(this), msg.sender, 10);
    erc721Token.transferFrom(address(this), msg.sender, tokenId);
    
    stakedOwners[tokenId] = address(0);
    OriginalOnwers[tokenId] = address(0);
}

}

