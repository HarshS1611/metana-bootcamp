const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    const erc20Token = await upgrades.deployProxy(ERC20Token, [], { initializer: 'initialize' });
    await erc20Token.waitForDeployment();
    console.log("ERC20TokenUpgradeable deployed to:", erc20Token.target);

    const ERC721Token = await ethers.getContractFactory("ERC721Token");
    const erc721Token = await upgrades.deployProxy(ERC721Token, [deployer.address], { initializer: 'initialize' });
    await erc721Token.waitForDeployment();
    console.log("ERC721TokenUpgradeable deployed to:", erc721Token.target);

    const NFTMinter = await ethers.getContractFactory("NFTMinter");
    const nftMinter = await upgrades.deployProxy(NFTMinter, [erc20Token.target, erc721Token.target, deployer.address], { initializer: 'initialize' });
    await nftMinter.waitForDeployment();
    console.log("NFTMinterUpgradeable deployed to:", nftMinter.target);

    await erc721Token.setNFTMintContract(nftMinter.target);
    console.log("NFTMinter contract address set in ERC721Token");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });