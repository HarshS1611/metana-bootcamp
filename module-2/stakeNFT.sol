// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    address public nftStakeContract;

    constructor(uint256 initialSupply, address initialOwner)
        ERC20("XHACKS", "XHS")
        Ownable(initialOwner)
    {
        _mint(msg.sender, initialSupply);
    }

    modifier onlyNFTStake() {
        require(
            msg.sender == nftStakeContract,
            "Only NFTStake contract can call this function"
        );
        _;
    }

    function setNFTStakeContract(address _nftStakeContract) external onlyOwner {
        require(
            nftStakeContract == address(0),
            "NFTStake contract already set"
        );
        nftStakeContract = _nftStakeContract;
    }

    function mint(address to, uint256 amount) external onlyNFTStake {
        _mint(to, amount);
    }
}

contract MyNFT is ERC721 {
    constructor() ERC721("MyNFT", "MNFT") {}

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
    }
    uint256 public constant lockTime = 15 seconds;

    mapping(address => mapping(uint256 => Stake)) public stakes;

    constructor(address _tokenAddress, IERC721 _nftAddress) {
        token = MyToken(_tokenAddress);
        nft = _nftAddress;
    }

    modifier onlyMyNFT() {
        require(
            msg.sender == address(nft),
            "Only MyNFT contract can call this function"
        );
        _;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external onlyMyNFT returns (bytes4) {
        Stake storage stake = stakes[from][tokenId];
        require(!stake.isActive, "You already have staked");
        stakes[from][tokenId] = Stake( block.timestamp, true);

        return IERC721Receiver.onERC721Received.selector;
    }

    function withdrawNFT(uint256 tokenId) external {
        Stake storage stake = stakes[msg.sender][tokenId];
        require(stake.isActive, "You don't have an active stake");
        uint256 elapsedTime = block.timestamp - stake.stakingTime;
        uint256 _multiplier = elapsedTime / lockTime;
        uint256 _rewardAmount = 10 * _multiplier;
        token.mint(msg.sender, _rewardAmount);
        stake.stakingTime = block.timestamp - (elapsedTime % lockTime);
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        delete stakes[msg.sender][tokenId];
    }

    function claimReward(uint256 tokenId) external {
        Stake storage stake = stakes[msg.sender][tokenId];
        uint256 elapsedTime = block.timestamp - stake.stakingTime;
        require(
            elapsedTime > lockTime,
            "Cannot claim yet."
        );
        uint256 _multiplier = elapsedTime / lockTime;
        uint256 _rewardAmount = 10 * _multiplier;
        token.mint(msg.sender, _rewardAmount);
        stake.stakingTime = block.timestamp - (elapsedTime % lockTime);
    }
}
