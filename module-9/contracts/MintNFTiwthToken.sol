// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract ERC20Token is Initializable, ERC20Upgradeable {

    function initialize() initializer public {
        __ERC20_init("XHACKS", "XHS");
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract ERC721Token is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    address public nftMintContract;

    function initialize(address initialOwner) initializer public {
        __ERC721_init("MyERC721", "M721");
        __Ownable_init(initialOwner);
    }

    modifier onlyNFTMinter() {
        require(
            msg.sender == nftMintContract,
            "Only NFTMinter contract can call this function"
        );
        _;
    }

    function setNFTMintContract(address _nftMintContract) external onlyOwner {
        require(
            nftMintContract == address(0),
            "NFTMinter contract already set"
        );
        nftMintContract = _nftMintContract;
    }

    function mint(address to, uint256 amount) external onlyNFTMinter {
        _mint(to, amount);
    }
}




contract NFTMinter is Initializable, OwnableUpgradeable {
    ERC20Token public erc20Token;
    ERC721Token public erc721Token;
    uint256 public tokenid;
    mapping(address => uint) public users;
    uint256 public constant NFT_PRICE = 10 ether;

    function initialize(
        ERC20Token _erc20Token,
        ERC721Token _erc721Token,
        address initialOwner
    ) initializer public {
        __Ownable_init(initialOwner);
        erc20Token = _erc20Token;
        erc721Token = _erc721Token;
    }

    function mintNFT() external {
        erc20Token.transferFrom(msg.sender, address(this), NFT_PRICE);
        users[msg.sender] = tokenid;
        erc721Token.mint(msg.sender, tokenid++);
    }

    function withdrawToken(address target) external onlyOwner {
        erc20Token.transfer(target, erc20Token.balanceOf(address(this)));
    }
}