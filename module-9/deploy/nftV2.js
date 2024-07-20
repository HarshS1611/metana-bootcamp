const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "YOUR_PROXY_ADDRESS"; // Replace with your proxy address
  const MyNFTUpgradeableV2 = await ethers.getContractFactory("MyNFTUpgradeableV2");
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