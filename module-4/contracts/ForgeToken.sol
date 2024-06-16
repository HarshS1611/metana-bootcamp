// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

abstract contract NFTContract is ERC1155, Ownable {
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
            'https://moccasin-passive-frog-784.mypinata.cloud/ipfs/QmZDoy9GuZaLnvYkGveJyqnZ4p98GpTntiKKb1XtGHmWFX/{id}'
        )
        Ownable(initialOwner)
    {}

    mapping(uint256 => string) private _uris;

    function freeMint(uint256 tokenid) external virtual {
        require(
            tokenid == 0 || tokenid == 1 || tokenid == 2,
            'This token can only be forged not minted'
        );
        uint256 elapsedTime = block.timestamp - lastMintTimestamp;
        require(elapsedTime > 1 minutes, 'Cannot mint token yet.');
        lastMintTimestamp = block.timestamp;
        _mint(msg.sender, tokenid, 1, '');
    }

    function uri(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return (_uris[tokenId]);
    }

    function setTokenUri(
        uint256 tokenId,
        string memory uri
    ) public virtual onlyOwner {
        require(bytes(_uris[tokenId]).length == 0, 'Cannot set uri twice');
        _uris[tokenId] = uri;
    }
}

contract ForgeToken is NFTContract {
    uint256 public constant amount = 1;

    constructor(address initialOwner) NFTContract(initialOwner) {}

    function ForgeTokenById(uint256 tokenid) external {
        require(
            tokenid == 3 || tokenid == 4 || tokenid == 5 || tokenid == 6,
            'This token can only be minted not forged'
        );
        if (tokenid == 3) {
            _burn(msg.sender, TOKEN_0, amount);
            _burn(msg.sender, TOKEN_1, amount);
            _mint(msg.sender, tokenid, amount, '');
        } else if (tokenid == 4) {
            _burn(msg.sender, TOKEN_1, amount);
            _burn(msg.sender, TOKEN_2, amount);
            _mint(msg.sender, tokenid, amount, '');
        } else if (tokenid == 5) {
            _burn(msg.sender, TOKEN_0, amount);
            _burn(msg.sender, TOKEN_2, amount);
            _mint(msg.sender, tokenid, amount, '');
        } else if (tokenid == 6) {
            _burn(msg.sender, TOKEN_0, amount);
            _burn(msg.sender, TOKEN_1, amount);
            _burn(msg.sender, TOKEN_2, amount);
            _mint(msg.sender, tokenid, amount, '');
        }
    }

    function tradeToken(uint256 tradeTokenId, uint256 receiveTokenId) external {
        require(tradeTokenId != receiveTokenId, 'Cannot trade same token');
        if (
            tradeTokenId == TOKEN_3 ||
            tradeTokenId == TOKEN_4 ||
            tradeTokenId == TOKEN_5 ||
            tradeTokenId == TOKEN_6
        ) {
            _burn(msg.sender, tradeTokenId, amount);
        } else {
            _burn(msg.sender, tradeTokenId, amount);
            _mint(msg.sender, receiveTokenId, amount, '');
        }
    }
}
