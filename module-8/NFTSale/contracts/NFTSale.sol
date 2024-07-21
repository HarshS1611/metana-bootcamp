// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./utils/RandomAssigned.sol";

contract AdvancedNFT is ERC721, Multicall, Ownable, RandomlyAssigned {
    using BitMaps for BitMaps.BitMap;

    enum State {
        Inactive,
        Presale,
        PublicSale,
        SoldOut
    }

    State public currentState;
    uint256 public constant MAX_SUPPLY = 10;
    uint256 public constant PRICE = 1 ether;
    uint256 totalShares;

    bytes32 private constant merkleRoot =
        0x5bc8f7c642e52771dbf7dfc1d71b1144964984f730f7a16a47c85599d3381b50;
    BitMaps.BitMap private mintedBitmap;

    struct Commit {
        bytes32 commit;
        uint256 block;
        bool revealed;
    }

    mapping(address => bool) public hasClaimed;
    mapping(address => Commit) public users;
    address[] public contributors;
    mapping(address => uint256) public contributorAmount;

    constructor()
        ERC721("XHACK", "XH")
        Ownable()
        RandomlyAssigned(MAX_SUPPLY * 2, 0)
    {
        currentState = State.Inactive;
    }

    modifier onlyInState(State state) {
        require(currentState == state, "Invalid state");
        _;
    }

    function setState(State newState) external onlyOwner {
        currentState = newState;
    }

    function presaleMint(
        uint256 index,
        bytes32[] calldata merkleProof,
        uint256 nonce
    ) external onlyInState(State.Presale) {
        require(!BitMaps.get(mintedBitmap, index), "Already minted");

        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, index)))
        );
        require(
            MerkleProof.verify(merkleProof, merkleRoot, leaf),
            "Invalid merkle proof"
        );

        BitMaps.set(mintedBitmap, index);
        require(!users[msg.sender].revealed, "Already committed");
        bytes32 commitment = keccak256(
            abi.encodePacked(msg.sender, index, nonce)
        );
        users[msg.sender].commit = commitment;
        users[msg.sender].block = block.number;
    }

    function revealMint(
        uint256 index,
        uint256 nonce
    ) external onlyInState(State.Presale) {
        require(users[msg.sender].commit > 0, "No commitment found");
        require(
            block.number >= users[msg.sender].block + 10,
            "Too early to reveal"
        );

        bytes32 commitment = users[msg.sender].commit;
        require(
            keccak256(abi.encodePacked(msg.sender, index, nonce)) == commitment,
            "Invalid commitment"
        );

        delete users[msg.sender];

        _safeMint(msg.sender, nextToken());

        if (tokenCount() == MAX_SUPPLY) {
            currentState = State.SoldOut;
        }
    }

    function puclicMint() external payable onlyInState(State.PublicSale) {
        require(msg.value >= PRICE, "Insufficient Payment");
        hasClaimed[msg.sender] = true;
        _safeMint(msg.sender, nextToken());

        if (tokenCount() == MAX_SUPPLY) {
            currentState = State.SoldOut;
        }
    }

    function BatchTokenTransfer(
        address[] calldata to,
        uint256[] calldata tokenIds
    ) external {
        require(to.length == tokenIds.length, "Arrays length mismatch");

        bytes[] memory calls = new bytes[](to.length);
        this.setApprovalForAll(address(this), true);

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

    function addContributor(
        address contributor,
        uint256 amount
    ) external onlyOwner {
        require(contributor != address(0), "Invalid contributor address");
        require(amount > 0, "Amounr must be greater than 0");
        totalShares += amount;

        contributors.push(contributor);
        contributorAmount[contributor] = amount;
    }

    function withdraw() external onlyOwner {
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 share = contributorAmount[contributor];
            uint256 amount = (address(this).balance * share) / totalShares;
            (bool success, ) = contributor.call{value: amount}("");
            require(success, "Transfer failed");
        }
    }
}
