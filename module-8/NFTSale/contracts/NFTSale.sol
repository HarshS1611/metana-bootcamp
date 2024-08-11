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
    mapping(address => Commit) public users;
    address[] public contributors;
    mapping(address => uint256) public contributorAmount;

    constructor()
        ERC721("XHACK", "XH")
        Ownable()
        RandomlyAssigned(MAX_SUPPLY, 0)
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

    
    function presaleMint(uint256 index, address target)
        external
        onlyInState(State.Presale)
        onlyOwner
    {
        require(!BitMaps.get(mintedBitmap, index), "Already minted");

        bytes32 commitment = keccak256(abi.encodePacked(target, index));
        users[target].commit = commitment;
        users[target].block = block.number;
    }

    function revealMint(bytes32[] calldata merkleProof, uint256 index)
        external
        onlyInState(State.Presale)
    {
        require(users[msg.sender].commit > 0, "No commitment found");
        require(
            block.number >= users[msg.sender].block + 10,
            "Too early to reveal"
        );
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(msg.sender, index)))
        );
        require(
            MerkleProof.verify(merkleProof, merkleRoot, leaf),
            "Invalid merkle proof"
        );


        require(
            keccak256(abi.encodePacked(msg.sender, index)) == users[msg.sender].commit,
            "Invalid commitment"
        );
        BitMaps.setTo(mintedBitmap, index, true);


        delete users[msg.sender];

        _safeMint(msg.sender, nextToken());

        if (tokenCount() == MAX_SUPPLY) {
            currentState = State.SoldOut;
        }
    }

    function puclicMint() external payable onlyInState(State.PublicSale) {
        require(msg.value >= PRICE, "Insufficient Payment");
        _safeMint(msg.sender, nextToken());

        if (tokenCount() == MAX_SUPPLY) {
            currentState = State.SoldOut;
        }
    }

    function batchTokenTransfer(
        address[] calldata to,
        uint256[] calldata tokenIds
    ) external {
        require(to.length == tokenIds.length, "Arrays length mismatch");

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

    function addContributor(address contributor, uint256 amount)
        external
        onlyOwner
    {
        require(contributor != address(0), "Invalid contributor address");
        require(amount > 0, "Amounr must be greater than 0");

        contributorAmount[contributor] = amount;
    }

    function withdrawShare() external {
        uint256 share = contributorAmount[msg.sender];
        require(share > 0, "No funds to withdraw");
        require(share <= address(this).balance, "Insufficient Balance");
        (bool success, ) = msg.sender.call{value: share}("");
        require(success, "Transfer failed");
    }

    receive() external payable { 
        puclicMint();
    }
}
