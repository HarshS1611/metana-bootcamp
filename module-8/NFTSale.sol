// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdvancedNFT is ERC721, Multicall, ReentrancyGuard, Ownable {
    using BitMaps for BitMaps.BitMap;

    enum State {
        Inactive,
        Presale,
        PublicSale,
        SoldOut
    }

    State public currentState;
    uint256 public constant MAX_SUPPLY = 10;
    uint256 public totalSupply;
    uint256 public constant PRICE = 1 ether;

    bytes32 private constant merkleRoot =
        0x5bc8f7c642e52771dbf7dfc1d71b1144964984f730f7a16a47c85599d3381b50;
    BitMaps.BitMap private mintedBitmap;

    struct Commit {
        bytes32 commit;
        uint256 block;
        bool revealed;
    }

    mapping(address => Commit) public users;
    address[] public contributors;
    mapping(address => uint256) public contributorShares;

    constructor() ERC721("XHACK", "XH") Ownable(msg.sender) {
        currentState = State.Inactive;
    }

    modifier onlyInState(State state) {
        require(currentState == state, "Invalid state");
        _;
    }

    function setState(State newState) external onlyOwner {
        currentState = newState;
    }

    function presaleMint(uint256 index, bytes32[] calldata merkleProof)
        external
        payable
        onlyInState(State.Presale)
    {
        require(msg.value >= PRICE, "Insufficient payment");
        require(!BitMaps.get(mintedBitmap, index), "Already minted");

        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, index)))
        );
        require(
            MerkleProof.verify(merkleProof, merkleRoot, leaf),
            "Invalid merkle proof"
        );

        BitMaps.setTo(mintedBitmap, index, true);
        _safeMint(msg.sender, totalSupply++);

        if (totalSupply == MAX_SUPPLY) {
            currentState = State.SoldOut;
        }
    }

    function commitMint(address user, uint256 nonce)
        external
        payable
        onlyInState(State.PublicSale)
    {
        require(msg.value >= PRICE, "Insufficient payment");
        require(!users[msg.sender].revealed, "Already committed");
        bytes32 commitment = keccak256(abi.encodePacked(user, nonce));
        users[msg.sender].revealed = true;
        users[msg.sender].commit = commitment;
        users[msg.sender].block = block.number;
    }

    function revealMint(uint256 nonce) external onlyInState(State.PublicSale) {
        require(users[msg.sender].commit > 0, "No commitment found");
        require(
            block.number >= users[msg.sender].block + 3,
            "Too early to reveal"
        );

        bytes32 commitment = users[msg.sender].commit;
        require(
            keccak256(abi.encodePacked(msg.sender, nonce)) == commitment,
            "Invalid nonce"
        );

        delete users[msg.sender];
        uint256 tokenId = uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(users[msg.sender].block),
                    block.timestamp,
                    nonce
                )
            )
        ) % MAX_SUPPLY;
        while (_ownerOf(tokenId) != address(0)) {
            tokenId = (tokenId + 1) % MAX_SUPPLY;
        }

        _safeMint(msg.sender, tokenId);
        totalSupply++;

        if (totalSupply == MAX_SUPPLY) {
            currentState = State.SoldOut;
        }
    }

    function BatchTransfer(address[] calldata to, uint256[] calldata tokenIds)
        external
    {
        require(to.length == tokenIds.length, "Arrays length mismatch");
        this.setApprovalForAll(address(this), true);
        bytes[] memory calls = new bytes[](to.length);
        for (uint256 i = 0; i < to.length; i++) {
             calls[i] = abi.encodeWithSelector(
            this.transferFrom.selector,
            msg.sender,
            to[i],
            tokenIds[i]
        );
        }
        this.multicall(calls);
    }

    // Withdrawal functions
    function addContributor(address contributor, uint256 shares)
        external
        onlyOwner
    {
        require(contributor != address(0), "Invalid contributor address");
        require(shares > 0, "Shares must be greater than 0");

        contributors.push(contributor);
        contributorShares[contributor] = shares;
    }

    function withdraw() external onlyOwner {
        uint256 totalShares;
        for (uint256 i = 0; i < contributors.length; i++) {
            totalShares += contributorShares[contributors[i]];
        }

        uint256 balance = address(this).balance;
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 share = contributorShares[contributor];
            uint256 amount = (balance * share) / totalShares;
            (bool success, ) = contributor.call{value: amount}("");
            require(success, "Transfer failed");
        }
    }
}
