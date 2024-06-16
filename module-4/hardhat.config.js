require("@nomicfoundation/hardhat-toolbox");
require("hardhat-prettier");
require('solidity-coverage')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  skipFiles: ["contracts/GodModeERC20.sol", "contracts/SanctionedERC20.sol", "contracts/MintNFTwithToken.sol",
    "contracts/SimpleNFT.sol", "contracts/StakeNFT.sol", "contracts/TokenSale.sol"],
};
