// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract ERC20Token is ERC20 {
    constructor() ERC20('XHACKS', 'XHS') {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract ERC721Token is ERC721, Ownable {
    address public nftMintContract;

    constructor(
        address initialOwner
    ) ERC721('MyERC721', 'M721') Ownable(initialOwner) {}

    modifier onlyNFTMinter() {
        require(
            msg.sender == nftMintContract,
            'Only NFTMinter contract can call this function'
        );
        _;
    }

    function setNFTMintContract(address _nftMintContract) external onlyOwner {
        require(
            nftMintContract == address(0),
            'NFTMinter contract already set'
        );
        nftMintContract = _nftMintContract;
    }

    function mint(address to, uint256 amount) external onlyNFTMinter {
        _mint(to, amount);
    }
}

contract NFTMinter is Ownable {
    ERC20Token public erc20Token;
    ERC721Token public erc721Token;
    uint256 public tokenid;
    mapping(address => uint) users;
    uint256 public constant NFT_PRICE = 10 ether;

    constructor(
        ERC20Token _erc20Token,
        ERC721Token _erc721Token,
        address initialOwner
    ) Ownable(initialOwner) {
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
