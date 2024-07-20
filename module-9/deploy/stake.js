const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  try {
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await upgrades.deployProxy(MyToken, [deployer.address], { initializer: 'initialize' });
    await myToken.waitForDeployment();
    console.log("MyTokenUpgradeable deployed to:", myToken.target);

    const MyNFT = await ethers.getContractFactory("MyNFT");
    const myNFT = await upgrades.deployProxy(MyNFT, [], { initializer: 'initialize' });
    await myNFT.waitForDeployment();
    console.log("MyNFTUpgradeable deployed to:", myNFT.target);

    const NFTStake = await ethers.getContractFactory("StakeNFT");
    const nftStake = await upgrades.deployProxy(NFTStake, [myToken.target, myNFT.target], { initializer: 'initialize' });
    await nftStake.waitForDeployment();
    console.log("NFTStakeUpgradeable deployed to:", nftStake.target);

    await myToken.setNFTStakeContract(nftStake.target);
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