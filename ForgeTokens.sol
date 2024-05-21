// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTContract is ERC1155, Ownable {
    uint256 public constant TOKEN_0 = 0;
    uint256 public constant TOKEN_1 = 1;
    uint256 public constant TOKEN_2 = 2;
    uint256 public constant TOKEN_3 = 3;
    uint256 public constant TOKEN_4 = 4;
    uint256 public constant TOKEN_5 = 5;
    uint256 public constant TOKEN_6 = 6;

    constructor(address initialOwner)
        ERC1155(
            "https://moccasin-passive-frog-784.mypinata.cloud/ipfs/QmZDoy9GuZaLnvYkGveJyqnZ4p98GpTntiKKb1XtGHmWFX/{id}"
        )
        Ownable()
    {}

    mapping(uint256 => string) private _uris;

    function mint(uint256 tokenid, uint256 amount) external {
        require(
            tokenid == 0 || tokenid == 1 || tokenid == 2,
            "This token can only be forged not minted"
        );
        _mint(msg.sender, tokenid, amount, "");
    }
    function mintExtra(address owner,uint256 tokenid, uint256 amount,address operator) external {
        require(operator != address(this),"Cannot Call this function");
        _mint(owner, tokenid, amount, "");
    }
    function burn(address onwer,uint256 id,uint256 amount) external  {
        _burn(onwer,id,amount);
    }

    function burnBatch(address onwer,uint[] memory ids,uint[] memory amount) external  {
        _burnBatch(onwer,ids,amount);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return (_uris[tokenId]);
    }

    function setTokenUri(uint256 tokenId, string memory uri)
        public
        virtual
        onlyOwner
    {
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
            forgeToken3(tokenid, amount);
        } else if (tokenid == 4) {
            forgeToken4(tokenid, amount);
        } else if (tokenid == 5) {
            forgeToken5(tokenid, amount);
        } else if (tokenid == 6) {
            forgeToken6(tokenid, amount);
        }
    }

    function forgeToken3(uint256 tokenid, uint256 amount) internal {
        uint256[] memory ids = new uint256[](2);
        ids[0] = TOKEN_0;
        ids[1] = TOKEN_1;
        uint256[] memory balances = new uint256[](2);
        balances[0] =
            nftAddress.balanceOf(msg.sender, TOKEN_0) -
            (nftAddress.balanceOf(msg.sender, TOKEN_0) - amount);
        balances[1] =
            nftAddress.balanceOf(msg.sender, TOKEN_1) -
            (nftAddress.balanceOf(msg.sender, TOKEN_1) - amount);
        require(
            balances[0] >= amount && balances[1] >= amount,
            "Insufficient Tokens"
        );

        nftAddress.burnBatch(msg.sender, ids, balances);
        nftAddress.mintExtra(msg.sender, tokenid, amount,address(this));
    }

    function forgeToken4(uint256 tokenid, uint256 amount) internal {
        uint256[] memory ids = new uint256[](2);
        ids[0] = TOKEN_1;
        ids[1] = TOKEN_2;
        uint256[] memory balances = new uint256[](2);
        balances[0] =
            nftAddress.balanceOf(msg.sender, TOKEN_1) -
            (nftAddress.balanceOf(msg.sender, TOKEN_1) - amount);
        balances[1] =
            nftAddress.balanceOf(msg.sender, TOKEN_2) -
            (nftAddress.balanceOf(msg.sender, TOKEN_2) - amount);
        require(
            balances[0] >= amount && balances[1] >= amount,
            "Insufficient Tokens"
        );
        nftAddress.burnBatch(msg.sender, ids, balances);
        nftAddress.mintExtra(msg.sender, tokenid, amount,address(this));
    }

    function forgeToken5(uint256 tokenid, uint256 amount) internal {
        uint256[] memory ids = new uint256[](2);
        ids[0] = TOKEN_0;
        ids[1] = TOKEN_2;
        uint256[] memory balances = new uint256[](2);
        balances[0] =
            nftAddress.balanceOf(msg.sender, TOKEN_0) -
            (nftAddress.balanceOf(msg.sender, TOKEN_0) - amount);
        balances[1] =
            nftAddress.balanceOf(msg.sender, TOKEN_2) -
            (nftAddress.balanceOf(msg.sender, TOKEN_2) - amount);
        require(
            balances[0] >= amount && balances[1] >= amount,
            "Insufficient Tokens"
        );
        nftAddress.burnBatch(msg.sender, ids, balances);
        nftAddress.mintExtra(msg.sender, tokenid, amount,address(this));
    }

    function forgeToken6(uint256 tokenid, uint256 amount) internal {
        uint256[] memory ids = new uint256[](3);
        ids[0] = TOKEN_0;
        ids[1] = TOKEN_1;
        ids[2] = TOKEN_2;
        uint256[] memory balances = new uint256[](3);
        balances[0] =
            nftAddress.balanceOf(msg.sender, TOKEN_0) -
            (nftAddress.balanceOf(msg.sender, TOKEN_0) - amount);
        balances[1] =
            nftAddress.balanceOf(msg.sender, TOKEN_1) -
            (nftAddress.balanceOf(msg.sender, TOKEN_1) - amount);
        balances[2] =
            nftAddress.balanceOf(msg.sender, TOKEN_2) -
            (nftAddress.balanceOf(msg.sender, TOKEN_2) - amount);
        require(
            balances[0] >= amount &&
                balances[1] >= amount &&
                balances[2] >= amount,
            "Insufficient Tokens"
        );
        nftAddress.burnBatch(msg.sender, ids, balances);
        nftAddress.mintExtra(msg.sender, tokenid, amount,address(this));
    }

    function tradeToken(
        uint256 tradeTokenId,
        uint256 tradeAmount,
        uint256 receiveTokenId
    ) external {
        require(
            tradeTokenId == TOKEN_3 ||
                tradeTokenId == TOKEN_4 ||
                tradeTokenId == TOKEN_5 ||
                tradeTokenId == TOKEN_6,
            "Can only trade tokens 3, 4, 5, or 6"
        );
        require(
            receiveTokenId == TOKEN_0 ||
                receiveTokenId == TOKEN_1 ||
                receiveTokenId == TOKEN_2,
            "Can only receive tokens 0, 1, or 2"
        );
        require(nftAddress.balanceOf(msg.sender, tradeTokenId) >= tradeAmount);

        nftAddress.burn(msg.sender, tradeTokenId, tradeAmount);
        nftAddress.mintExtra(msg.sender, receiveTokenId, tradeAmount,address(this));
    }
}
