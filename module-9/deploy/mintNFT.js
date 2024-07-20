const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy ERC20TokenUpgradeable
    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    const erc20Token = await upgrades.deployProxy(ERC20Token, [], { initializer: 'initialize' });
    await erc20Token.deployed();
    console.log("ERC20TokenUpgradeable deployed to:", erc20Token.target);

    // Deploy ERC721TokenUpgradeable
    const ERC721Token = await ethers.getContractFactory("ERC721Token");
    const erc721Token = await upgrades.deployProxy(ERC721Token, [deployer.address], { initializer: 'initialize' });
    await erc721Token.deployed();
    console.log("ERC721TokenUpgradeable deployed to:", erc721Token.target);

    // Deploy NFTMinterUpgradeable
    const NFTMinter = await ethers.getContractFactory("NFTMinter");
    const nftMinter = await upgrades.deployProxy(NFTMinter, [erc20Token.target, erc721Token.target, deployer.address], { initializer: 'initialize' });
    await nftMinter.deployed();
    console.log("NFTMinterUpgradeable deployed to:", nftMinter.target);

    // Set NFTMinter contract address in ERC721Token
    await erc721Token.setNFTMintContract(nftMinter.target);
    console.log("NFTMinter contract address set in ERC721Token");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });