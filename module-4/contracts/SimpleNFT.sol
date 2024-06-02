// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract MyNFT is ERC721, Ownable2Step {

    uint256 public constant MAX_SUPPLY = 10;

    constructor() ERC721("MyNFTCollection", "MNFT") Ownable(msg.sender) {}

    function mint() public {
        require(totalSupply < MAX_SUPPLY, "Maximum supply reached");
        _safeMint(msg.sender, totalSupply++);
    }


    function _baseURI() internal pure override  returns  (string memory) {
        return "ipfs://QmUhvx74Xtepfoz3RbtftcEiWzaWDP2P3KhNTo8GvMEui4/";
    }

}