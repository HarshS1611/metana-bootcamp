// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract MyTokenUpgradeable is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address public nftStakeContract;

    /// @custom:oz-upgrades-unsafe-allow constructor

    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __ERC20_init("XHACKS", "XHS");
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
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

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}

contract MyNFTUpgradeable is Initializable, ERC721Upgradeable, UUPSUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC721_init("MyNFT", "MNFT");
        __UUPSUpgradeable_init();
    }

    function mint(uint256 tokenId) public {
        _mint(msg.sender, tokenId);
    }

    function _authorizeUpgrade(address newImplementation) internal override {}
}

contract NFTStakeUpgradeable is
    Initializable,
    IERC721Receiver,
    UUPSUpgradeable
{
    MyTokenUpgradeable public token;
    IERC721 public nft;

    struct Stake {
        uint256 stakingTime;
        bool isActive;
        address intialOwner;
    }
    uint256 public constant lockTime = 1 days;

    mapping(uint256 => Stake) public stakes;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _tokenAddress,
        IERC721 _nftAddress
    ) public initializer {
        __UUPSUpgradeable_init();
        token = MyTokenUpgradeable(_tokenAddress);
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
    ) external override onlyMyNFT returns (bytes4) {
        Stake storage stake = stakes[tokenId];
        require(!stake.isActive, "You already have staked");
        stakes[tokenId] = Stake(block.timestamp, true, from);

        return IERC721Receiver.onERC721Received.selector;
    }

    function claimToken(uint256 tokenId, bool isWithdrawn) internal {
        Stake storage stake = stakes[tokenId];
        require(stake.isActive, "You don't have an active stake");
        uint256 elapsedTime = block.timestamp - stake.stakingTime;
        require((elapsedTime > lockTime) || isWithdrawn, "Cannot claim yet.");
        uint256 _multiplier = elapsedTime / lockTime;
        uint256 _rewardAmount = 10 * _multiplier;
        token.mint(stake.intialOwner, _rewardAmount);
        stake.stakingTime += lockTime * _multiplier;
    }

    function withdrawNFT(uint256 tokenId) external {
        claimToken(tokenId, true);
        nft.safeTransferFrom(address(this), msg.sender, tokenId);
        delete stakes[tokenId];
    }

    function claimReward(uint256 tokenId) external {
        claimToken(tokenId, false);
    }

    function _authorizeUpgrade(address newImplementation) internal override {}
}
