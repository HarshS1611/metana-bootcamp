// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("XHACKS", "XHS") {
        _mint(msg.sender, initialSupply);
    }
}

contract MyNFT is ERC721 {
    constructor() ERC721("MyNFT", "MNFT") {}

}

contract NFTStake is IERC721Receiver {
    MyToken public token;
    IERC721 public nft;

    struct Stake {
        uint256 tokenId;
        uint256 stakingTime;
        bool isActive;
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
    ) internal returns (bytes4) {
        stakes[from] = Stake(tokenId, block.timestamp, true);

        return IERC721Receiver.onERC721Received.selector;
    }

    function withdrawNFT() external {
        Stake storage stake = stakes[msg.sender];
        require(stake.isActive, "You don't have an active stake");
        claimReward();
        nft.safeTransferFrom(address(this), msg.sender, stake.tokenId);
        delete stakes[msg.sender];
    }

    function claimReward() external {
        Stake storage stake = stakes[msg.sender];
        uint256 elapsedTime = block.timestamp - stake.stakingTime;
        uint256 _multiplier = elapsedTime / lockTime;
        uint256 _rewardAmount = 10 ether * _multiplier;
        token.mint(msg.sender, _rewardAmount);
        stake.stakingTime = block.timestamp - (elapsedTime % lockTime);
    }
}
