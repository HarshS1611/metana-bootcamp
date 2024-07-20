const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0xA3Dd0202fc3824D402D2E2947dfadeabf6081eB5"; 
  const MyNFTUpgradeableV2 = await ethers.getContractFactory("MyNFTV2");
  console.log("Upgrading MyNFTUpgradeable...");
  await upgrades.upgradeProxy(proxyAddress, MyNFTUpgradeableV2);
  console.log("MyNFTUpgradeable upgraded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });