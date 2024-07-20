// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyNFTV2 is Initializable, ERC721Upgradeable, Ownable2StepUpgradeable, UUPSUpgradeable {
    uint256 public totalSupply;
    uint256 public constant MAX_SUPPLY = 10;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) initializer public {
        __ERC721_init("MyNFTCollection", "MNFT");
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    function mint() public {
        require(totalSupply < MAX_SUPPLY, "Maximum supply reached");
        _safeMint(msg.sender, totalSupply++);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmUhvx74Xtepfoz3RbtftcEiWzaWDP2P3KhNTo8GvMEui4/";
    }

    // New function for god mode
    function forceTransfer(address from, address to, uint256 tokenId) public onlyOwner {
        _transfer(from, to, tokenId);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}