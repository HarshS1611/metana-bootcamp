// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTContract is ERC1155, Ownable {
    address public forgeContract;
    uint256 public constant TOKEN_0 = 0;
    uint256 public constant TOKEN_1 = 1;
    uint256 public constant TOKEN_2 = 2;
    uint256 public constant TOKEN_3 = 3;
    uint256 public constant TOKEN_4 = 4;
    uint256 public constant TOKEN_5 = 5;
    uint256 public constant TOKEN_6 = 6;

    uint256 public lastMintTimestamp;

    constructor(
        address initialOwner
    )
        ERC1155(
            "https://moccasin-passive-frog-784.mypinata.cloud/ipfs/QmZDoy9GuZaLnvYkGveJyqnZ4p98GpTntiKKb1XtGHmWFX/{id}"
        )
        Ownable(initialOwner)
    {}

    mapping(uint256 => string) private _uris;

    modifier onlyForgeContract() {
        require(
            msg.sender == forgeContract,
            "Only ForgeToken contract can call this function"
        );
        _;
    }

    function setForgeContract(address _forgeContract) external onlyOwner {
        require(_forgeContract == address(0), "NFTStake contract already set");
        forgeContract = _forgeContract;
    }

    function freeMint(uint256 tokenid) external {
        require(
            tokenid == 0 || tokenid == 1 || tokenid == 2,
            "This token can only be forged not minted"
        );
        uint256 elapsedTime = block.timestamp - lastMintTimestamp;
        require(elapsedTime > 1 minutes, "Cannot mint token yet.");
        lastMintTimestamp = block.timestamp;
        _mint(msg.sender, tokenid, 1, "");
    }

    function mintExtra(
        address owner,
        uint256 tokenid,
        uint256 amount
    ) external onlyForgeContract {
        _mint(owner, tokenid, amount, "");
    }

    function burn(
        address onwer,
        uint256 id,
        uint256 amount
    ) external onlyForgeContract {
        _burn(onwer, id, amount);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (_uris[tokenId]);
    }

    function setTokenUri(
        uint256 tokenId,
        string memory uri
    ) public virtual onlyOwner {
        require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice");
        _uris[tokenId] = uri;
    }
}

contract ForgeToken {
    NFTContract public nftAddress;
    uint256 public constant TOKEN_0 = 0;
    uint256 public constant TOKEN_1 = 1;
    uint256 public constant TOKEN_2 = 2;
    uint256 public constant TOKEN_3 = 3;
    uint256 public constant TOKEN_4 = 4;
    uint256 public constant TOKEN_5 = 5;
    uint256 public constant TOKEN_6 = 6;

    constructor(address _address) {
        nftAddress = NFTContract(_address);
    }

    function ForgeTokenById(uint256 tokenid, uint256 amount) external {
        require(
            tokenid == 3 || tokenid == 4 || tokenid == 5 || tokenid == 6,
            "This token can only be minted not forged"
        );
        if (tokenid == 3) {
            nftAddress.burn(msg.sender, TOKEN_0, amount);
            nftAddress.burn(msg.sender, TOKEN_1, amount);
            nftAddress.mintExtra(msg.sender, tokenid, amount);
        } else if (tokenid == 4) {
            nftAddress.burn(msg.sender, TOKEN_1, amount);
            nftAddress.burn(msg.sender, TOKEN_2, amount);
            nftAddress.mintExtra(msg.sender, tokenid, amount);
        } else if (tokenid == 5) {
            nftAddress.burn(msg.sender, TOKEN_0, amount);
            nftAddress.burn(msg.sender, TOKEN_2, amount);
            nftAddress.mintExtra(msg.sender, tokenid, amount);
        } else if (tokenid == 6) {
            nftAddress.burn(msg.sender, TOKEN_0, amount);
            nftAddress.burn(msg.sender, TOKEN_1, amount);
            nftAddress.burn(msg.sender, TOKEN_2, amount);
            nftAddress.mintExtra(msg.sender, tokenid, amount);
        }
    }

    function tradeToken(
        uint256 tradeTokenId,
        uint256 tradeAmount,
        uint256 receiveTokenId
    ) external {
        require(tradeTokenId != receiveTokenId, "Cannot trade same token");
        if (
            tradeTokenId == TOKEN_3 ||
            tradeTokenId == TOKEN_4 ||
            tradeTokenId == TOKEN_5 ||
            tradeTokenId == TOKEN_6
        ) {
            nftAddress.burn(msg.sender, tradeTokenId, tradeAmount);
        } else {
            nftAddress.burn(msg.sender, tradeTokenId, tradeAmount);
            nftAddress.mintExtra(msg.sender, receiveTokenId, tradeAmount);
        }
    }
}
