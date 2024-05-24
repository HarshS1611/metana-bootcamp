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
        _mint(account, amount * 1 ether);
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
    IERC721 public nft;

    struct Stake {
        uint256 tokenId;
        uint256 stakingTime;
    }
    uint256 public constant lockTime = 1 days;

    mapping(address => Stake) public stakes;

    constructor(address _tokenAddress, IERC721 _nftAddress) {
        token = MyToken(_tokenAddress);
        nft = _nftAddress;
    }
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        require(stakes[msg.sender].tokenId == 0, "You already have an active stake");
        stakes[from] = Stake(tokenId, block.timestamp);

        return IERC721Receiver.onERC721Received.selector;
    }



    function withdrawNFT() external {
        Stake storage stake = stakes[msg.sender];
        require(stake.tokenId >= 0, "You don't have an active stake");

        nft.safeTransferFrom(address(this), msg.sender, stake.tokenId);
        delete stakes[msg.sender];
    }

    function claimReward() external {
        Stake storage stake = stakes[msg.sender];
        require(stake.tokenId >= 0, "You don't have an active stake");
        require(block.timestamp >= stake.stakingTime + lockTime, "Reward period not over yet");

        token.mint(msg.sender, 10 * 1 ether);
        stake.stakingTime = block.timestamp;
    }
}
