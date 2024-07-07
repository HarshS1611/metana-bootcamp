// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

abstract contract NFTContract is ERC1155, Ownable {
    using Strings for uint256;

    uint256 public constant TOKEN_0 = 0;
    uint256 public constant TOKEN_1 = 1;
    uint256 public constant TOKEN_2 = 2;
    uint256 public constant TOKEN_3 = 3;
    uint256 public constant TOKEN_4 = 4;
    uint256 public constant TOKEN_5 = 5;
    uint256 public constant TOKEN_6 = 6;

    uint256 public lastMintTimestamp;

    constructor(address initialOwner)
        ERC1155(
            "https://moccasin-passive-frog-784.mypinata.cloud/ipfs/QmZDoy9GuZaLnvYkGveJyqnZ4p98GpTntiKKb1XtGHmWFX/"
        )
        Ownable()
    {}

    function freeMint(uint256 tokenid) external virtual {
        require(
            tokenid == 0 || tokenid == 1 || tokenid == 2,
            "This token can only be forged not minted"
        );
        uint256 elapsedTime = block.timestamp - lastMintTimestamp;
        require(elapsedTime > 1 minutes, "Cannot mint token yet.");
        lastMintTimestamp = block.timestamp;
        _mint(msg.sender, tokenid, 1, "");
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        returns (string memory)
    {   
        require(tokenId >=0 && tokenId <7,"Invalid token Id");
        string memory baseURI = uri(tokenId);
        return
            bytes(baseURI).length > 0
                ? string.concat(baseURI, tokenId.toString())
                : "";
    }
}

contract ForgeToken is NFTContract {
    constructor(address initialOwner) NFTContract(initialOwner) {}

    function ForgeTokenById(uint256 tokenid) external {
        require(
            tokenid == 3 || tokenid == 4 || tokenid == 5 || tokenid == 6,
            "This token can only be minted not forged"
        );
        if (tokenid == 3) {
            _burn(msg.sender, TOKEN_0, 1);
            _burn(msg.sender, TOKEN_1, 1);
        } else if (tokenid == 4) {
            _burn(msg.sender, TOKEN_1, 1);
            _burn(msg.sender, TOKEN_2, 1);
        } else if (tokenid == 5) {
            _burn(msg.sender, TOKEN_0, 1);
            _burn(msg.sender, TOKEN_2, 1);
        } else if (tokenid == 6) {
            _burn(msg.sender, TOKEN_0, 1);
            _burn(msg.sender, TOKEN_1, 1);
            _burn(msg.sender, TOKEN_2, 1);
        }
        _mint(msg.sender, tokenid, 1, "");
    }

    function tradeToken(uint256 tradeTokenId, uint256 receiveTokenId) external {
        require(tradeTokenId != receiveTokenId, "Cannot trade same token");
        require(
            tradeTokenId >= 0 && tradeTokenId < 7,
            "Invalid trade token Id"
        );
        if (
            tradeTokenId == TOKEN_3 ||
            tradeTokenId == TOKEN_4 ||
            tradeTokenId == TOKEN_5 ||
            tradeTokenId == TOKEN_6
        ) {
            _burn(msg.sender, tradeTokenId, 1);
        } else {
            _burn(msg.sender, tradeTokenId, 1);
            _mint(msg.sender, receiveTokenId, 1, "");
        }
    }
}
