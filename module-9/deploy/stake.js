const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  try {
    // Deploy MyTokenUpgradeable
    const MyToken = await ethers.getContractFactory("MyTokenUpgradeable");
    const myToken = await upgrades.deployProxy(MyToken, [deployer.address], { initializer: 'initialize' });
    await myToken.waitForDeployment();
    console.log("MyTokenUpgradeable deployed to:", await myToken.getAddress());

    // Deploy MyNFTUpgradeable
    const MyNFT = await ethers.getContractFactory("MyNFTUpgradeable");
    const myNFT = await upgrades.deployProxy(MyNFT, [], { initializer: 'initialize' });
    await myNFT.waitForDeployment();
    console.log("MyNFTUpgradeable deployed to:", await myNFT.getAddress());

    // Deploy NFTStakeUpgradeable
    const NFTStake = await ethers.getContractFactory("NFTStakeUpgradeable");
    const nftStake = await upgrades.deployProxy(NFTStake, [await myToken.getAddress(), await myNFT.getAddress()], { initializer: 'initialize' });
    await nftStake.waitForDeployment();
    console.log("NFTStakeUpgradeable deployed to:", await nftStake.getAddress());

    // Set NFTStake contract address in MyToken
    await myToken.setNFTStakeContract(await nftStake.getAddress());
    console.log("NFTStake contract address set in MyToken");
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });