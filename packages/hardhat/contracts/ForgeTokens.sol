// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ForgeToken is ERC1155, Ownable {
	uint256 public constant TOKEN_0 = 0;
	uint256 public constant TOKEN_1 = 1;
	uint256 public constant TOKEN_2 = 2;
	uint256 public constant TOKEN_3 = 3;
	uint256 public constant TOKEN_4 = 4;
	uint256 public constant TOKEN_5 = 5;
	uint256 public constant TOKEN_6 = 6;

	constructor(
		address initialOwner
	)
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

	function ForgeTokenById(uint256 tokenid, uint256 amount) external {
		require(
			tokenid == 3 || tokenid == 4 || tokenid == 5 || tokenid == 6,
			"This token can only be minted not forged"
		);
		if (tokenid == 3) {
			forgeToken3(amount);
		} else if (tokenid == 4) {
			forgeToken4(amount);
		} else if (tokenid == 5) {
			forgeToken5(amount);
		} else if (tokenid == 6) {
			forgeToken6(amount);
		}
	}

	function forgeToken3(uint256 amount) internal {
		uint256[] memory ids = new uint256[](2);
		ids[0] = TOKEN_0;
		ids[1] = TOKEN_1;
		uint256[] memory balances = new uint256[](2);
		balances[0] =
			balanceOf(msg.sender, TOKEN_0) -
			(balanceOf(msg.sender, TOKEN_0) - amount);
		balances[1] =
			balanceOf(msg.sender, TOKEN_1) -
			(balanceOf(msg.sender, TOKEN_1) - amount);
		require(
			balances[0] >= amount && balances[1] >= amount,
			"Insufficient Tokens"
		);
		_burnBatch(msg.sender, ids, balances);
		_mint(msg.sender, TOKEN_3, amount, "");
	}

	function forgeToken4(uint256 amount) internal {
		uint256[] memory ids = new uint256[](2);
		ids[0] = TOKEN_1;
		ids[1] = TOKEN_2;
		uint256[] memory balances = new uint256[](2);
		balances[0] =
			balanceOf(msg.sender, TOKEN_1) -
			(balanceOf(msg.sender, TOKEN_1) - amount);
		balances[1] =
			balanceOf(msg.sender, TOKEN_2) -
			(balanceOf(msg.sender, TOKEN_2) - amount);
		require(
			balances[0] >= amount && balances[1] >= amount,
			"Insufficient Tokens"
		);
		_burnBatch(msg.sender, ids, balances);
		_mint(msg.sender, TOKEN_4, amount, "");
	}

	function forgeToken5(uint256 amount) internal {
		uint256[] memory ids = new uint256[](2);
		ids[0] = TOKEN_0;
		ids[1] = TOKEN_2;
		uint256[] memory balances = new uint256[](2);
		balances[0] =
			balanceOf(msg.sender, TOKEN_0) -
			(balanceOf(msg.sender, TOKEN_0) - amount);
		balances[1] =
			balanceOf(msg.sender, TOKEN_2) -
			(balanceOf(msg.sender, TOKEN_2) - amount);
		require(
			balances[0] >= amount && balances[1] >= amount,
			"Insufficient Tokens"
		);
		_burnBatch(msg.sender, ids, balances);
		_mint(msg.sender, TOKEN_5, amount, "");
	}

	function forgeToken6(uint256 amount) internal {
		uint256[] memory ids = new uint256[](3);
		ids[0] = TOKEN_0;
		ids[1] = TOKEN_1;
		ids[2] = TOKEN_2;
		uint256[] memory balances = new uint256[](3);
		balances[0] =
			balanceOf(msg.sender, TOKEN_0) -
			(balanceOf(msg.sender, TOKEN_0) - amount);
		balances[1] =
			balanceOf(msg.sender, TOKEN_1) -
			(balanceOf(msg.sender, TOKEN_1) - amount);
		balances[2] =
			balanceOf(msg.sender, TOKEN_2) -
			(balanceOf(msg.sender, TOKEN_2) - amount);
		require(
			balances[0] >= amount &&
				balances[1] >= amount &&
				balances[2] >= amount,
			"Insufficient Tokens"
		);
		_burnBatch(msg.sender, ids, balances);
		_mint(msg.sender, TOKEN_6, amount, "");
	}

	 function tradeToken(
        uint256 tradeTokenId,
        uint256 tradeAmount,
        uint256 receiveTokenId
    ) external {
        require(
            tradeTokenId != receiveTokenId,
            "Same token trade not allowed"
        );
        require(
            receiveTokenId == TOKEN_0 ||
                receiveTokenId == TOKEN_1 ||
                receiveTokenId == TOKEN_2,
            "Can only receive tokens 0, 1, or 2"
        );
        require(balanceOf(msg.sender, tradeTokenId) >= tradeAmount);

        _burn(msg.sender, tradeTokenId, tradeAmount);
        _mint(msg.sender, receiveTokenId, tradeAmount, "");
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
