// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyNFTV1 is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    uint256 public totalSupply;
    uint256 public constant MAX_SUPPLY = 10;

    function initialize(address initialOwner) initializer public {
        __ERC721_init("MyNFTCollection", "MNFT");
        __Ownable_init(initialOwner);
    }

    function mint() public {
        require(totalSupply < MAX_SUPPLY, "Maximum supply reached");
        _safeMint(msg.sender, totalSupply++);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmUhvx74Xtepfoz3RbtftcEiWzaWDP2P3KhNTo8GvMEui4/";
    }
}