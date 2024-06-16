// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MyToken is ERC20, Ownable {
    address public nftStakeContract;

    constructor(
        address initialOwner
    ) ERC20('XHACKS', 'XHS') Ownable(initialOwner) {}

    modifier onlyNFTStake() {
        require(
            msg.sender == nftStakeContract,
            'Only NFTStake contract can call this function'
        );
        _;
    }

    function setNFTStakeContract(address _nftStakeContract) external onlyOwner {
        require(
            nftStakeContract == address(0),
            'NFTStake contract already set'
        );
        nftStakeContract = _nftStakeContract;
    }

    function mint(address to, uint256 amount) external onlyNFTStake {
        _mint(to, amount);
    }
}

contract MyNFT is ERC721 {
    constructor() ERC721('MyNFT', 'MNFT') {}

    function mint(uint256 tokenId) public {
        _mint(msg.sender, tokenId);
    }
}

contract NFTStake is IERC721Receiver {
    MyToken public token;
    IERC721 public nft;

    struct Stake {
        uint256 stakingTime;
        bool isActive;
        address intialOwner;
    }
    uint256 public constant lockTime = 1 days;

    mapping(uint256 => Stake) public stakes;

    constructor(address _tokenAddress, IERC721 _nftAddress) {
        token = MyToken(_tokenAddress);
        nft = _nftAddress;
    }

    modifier onlyMyNFT() {
        require(
            msg.sender == address(nft),
            'Only MyNFT contract can call this function'
        );
        _;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external onlyMyNFT returns (bytes4) {
        Stake storage stake = stakes[tokenId];
        require(!stake.isActive, 'You already have staked');
        stakes[tokenId] = Stake(block.timestamp, true, from);

        return IERC721Receiver.onERC721Received.selector;
    }

    function claimLogic(
        Stake memory stake
    ) internal returns (uint256 multiplier) {
        uint256 elapsedTime = block.timestamp - stake.stakingTime;
        uint256 _multiplier = elapsedTime / lockTime;
        uint256 _rewardAmount = 10 * _multiplier;
        token.mint(stake.intialOwner, _rewardAmount);

        return _multiplier;
    }

    function withdrawNFT(uint256 tokenId) external {
        Stake storage stake = stakes[tokenId];
        require(stake.isActive, "You don't have an active stake");
        uint256 multiplier = claimLogic(stake);
        stake.stakingTime += lockTime * multiplier;
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        delete stakes[tokenId];
    }

    function claimReward(uint256 tokenId) external {
        Stake storage stake = stakes[tokenId];
        uint256 elapsedTime = block.timestamp - stake.stakingTime;
        require(elapsedTime > lockTime, 'Cannot claim yet.');
        uint256 multiplier = claimLogic(stake);
        stake.stakingTime += lockTime * multiplier;
    }
}
