module.exports = {
  buildDir: 'build',
  contractsDir: 'contracts',
  testDir: 'test',
  skipContracts: ['GodModeERC20.sol','MintNFTwithToken.sol','SanctionedERC20.sol','SanctionedERC20.sol','SimpleNFT.sol',
    'StakeNFT.sol','TokenSale.sol'
  ], 
  skipTests: [],
  testingTimeOutInSec: 300,
  network: "none",
  testingFramework: "hardhat",
  minimal: false,
  tce: false
}