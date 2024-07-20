const { ethers, upgrades } = require("hardhat");

async function main() {

    [deployer] = await ethers.getSigners();

    const nftV1 = await ethers.getContractFactory("MyNFTV1");
    const nftV1Contract = await upgrades.deployProxy(nftV1, [deployer.address], { initializer: 'initialize' });
    await nftV1Contract.waitForDeployment();

    console.log("MyNFT deployed to:", nftV1Contract.target);

}

main()

