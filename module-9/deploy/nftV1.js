const { ethers, upgrades } = require("hardhat");

async function main() {

    const nftV1 = await ethers.getContractFactory("MyNFTV1");
    const nftV1Contract = await upgrades.deployProxy(nftV1, [], { initializer: 'initialize' });
    await nftV1Contract.waitForDeployment();

    console.log("MyNFT deployed to:", nftV1Contract.target);

}

main()

