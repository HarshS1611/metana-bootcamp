// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("XHACKS", "XHS") {
        _mint(msg.sender, initialSupply);
    }
    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }
}

contract MyNFT is ERC721 {
    constructor() ERC721("MyNFT", "MNFT") {}

    function mint(uint256 tokenId) public {
        _safeMint(msg.sender, tokenId);
    }
}

contract NFTStake is IERC721Receiver  {
    MyToken public token;
    MyNFT public nft;

    struct Stake {
        uint256 tokenId;
        uint256 stakingTime;
    }

    mapping(address => Stake) public stakes;

    constructor(address _tokenAddress, address _nftAddress) {
        token = MyToken(_tokenAddress);
        nft = MyNFT(_nftAddress);
    }
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function stakeNFT(uint256 tokenId) external {
        require(nft.ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        require(stakes[msg.sender].tokenId == 0, "You already have an active stake");

        nft.transferFrom(msg.sender, address(this), tokenId);
        stakes[msg.sender] = Stake(tokenId, block.timestamp);
    }

    function withdrawNFT() external {
        Stake storage stake = stakes[msg.sender];
        require(stake.tokenId >= 0, "You don't have an active stake");

        nft.transferFrom(address(this), msg.sender, stake.tokenId);
        delete stakes[msg.sender];
    }

    function claimReward() external {
        Stake storage stake = stakes[msg.sender];
        require(stake.tokenId >= 0, "You don't have an active stake");
        require(block.timestamp >= stake.stakingTime + 1 days, "Reward period not over yet");

        token.mint(msg.sender, 10);
        stake.stakingTime = block.timestamp;
    }
}