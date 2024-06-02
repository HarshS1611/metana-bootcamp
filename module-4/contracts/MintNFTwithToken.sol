// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
    I have used onlyNFTMinter modifier in ERC721Token contract to restrict the mint function to be called only by NFTMinter contract.
    As it was giving error while using mint or _mint function in NFTMinter contract.


    TypeError: Member "mint" not found or not visible after argument-dependent lookup in contract ERC721Token.
  --> contracts/MintNFTwithToken.sol:70:9:
   |
70 |         erc721Token.mint(msg.sender, tokenid);
   |         ^^^^^^^^^^^^^^^^
*/

contract ERC20Token is ERC20 {
    constructor(uint256 initialSupply) ERC20("XHACKS", "XHS") {
        _mint(msg.sender, initialSupply * 1 ether);
    }

    /* 
        I have added mint function to mint Tokens to the users. As its not visible after deplying in the contract.
    */
    function mint(address to, uint256 amount) external {
        _mint(to, amount * 1 ether);
    }

}

contract ERC721Token is ERC721, Ownable {
    address public nftMintContract;

    constructor(address initialOwner)
        ERC721("MyERC721", "M721")
        Ownable(initialOwner)
    {}

    modifier onlyNFTMinter() {
        require(
            msg.sender == nftMintContract,
            "Only NFTStake contract can call this function"
        );
        _;
    }

    function setNFTStakeContract(address _nftMintContract) external onlyOwner {
        require(nftMintContract == address(0), "NFTStake contract already set");
        nftMintContract = _nftMintContract;
    }

    function mint(address to, uint256 amount) external onlyNFTMinter {
        _mint(to, amount);
    }
}

contract NFTMinter is IERC721Receiver {
    ERC20Token public erc20Token;
    ERC721Token public erc721Token;
    uint256 public tokenid;

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

    function mintNFT(uint256 amount) external {
        require(
            erc20Token.balanceOf(msg.sender) >= (amount * 1 ether) &&
                amount == 10,
            "Insufficient Balance"
        );

        erc20Token.transferFrom(msg.sender, address(this), amount * 1 ether);
        erc721Token.mint(msg.sender, tokenid);
        tokenid++;
    }
}