require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
const dotenv = require('dotenv');

dotenv.config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",

  networks: {
    hardhat: {
      chainId: 1337
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
