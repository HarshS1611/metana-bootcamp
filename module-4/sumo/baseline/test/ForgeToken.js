const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("hardhat");

describe("NFTContract", function () {
    let NFTContract, nftContract, owner, addr1, addr2;

    async function deployNFTFixture() {
        [owner, addr1, addr2] = await hre.ethers.getSigners();

        NFTContract = await hre.ethers.getContractFactory("NFTContract");
        nftContract = await NFTContract.deploy(owner.address);

        return { nftContract, owner, addr1, addr2 };
    };

    it("should mint tokens", async function () {
        const { nftContract, owner, addr1, addr2 } = await loadFixture(deployNFTFixture);
        await nftContract.connect(addr1).mint(0);
        const balance = await nftContract.balanceOf(addr1.address, 0);
        expect(balance).to.equal(1);
    });

    it("should not mint invalid tokens", async function () {
        const { nftContract, owner, addr1, addr2 } = await loadFixture(deployNFTFixture);
        await expect(nftContract.connect(addr1).mint(3)).to.be.revertedWith(
            "This token can only be forged not minted"
        );
    });

    it("should not mint if time elapsed is less than 1 minute", async function () {
        const { nftContract, owner, addr1, addr2 } = await loadFixture(deployNFTFixture);
        await nftContract.connect(addr1).mint(0);
        await expect(nftContract.connect(addr1).mint(0)).to.be.revertedWith(
            "Cannot mint token yet."
        );
    });

    it("should set token URI", async function () {
        const { nftContract, owner, addr1, addr2 } = await loadFixture(deployNFTFixture);
        const uri = "https://example.com/token/{id}.json";
        await nftContract.connect(owner).setTokenUri(0, uri);
        expect(await nftContract.uri(0)).to.equal(uri);
    });

    it("should not set token URI twice", async function () {
        const { nftContract, owner, addr1, addr2 } = await loadFixture(deployNFTFixture);
        const uri = "https://example.com/token/{id}.json";
        await nftContract.connect(owner).setTokenUri(0, uri);
        await expect(nftContract.connect(owner).setTokenUri(0, uri)).to.be.revertedWith(
            "Cannot set uri twice"
        );
    });

    it("should not set token URI if not owner", async function () {
        const { nftContract, owner, addr1, addr2 } = await loadFixture(deployNFTFixture);
        const uri = "https://example.com/token/{id}.json";
        await expect(nftContract.connect(addr1).setTokenUri(0, uri)).to.be.reverted;
    });


});


describe("ForgeToken", function () {
    async function deployForgeFixture() {
        let ForgeToken, forgeToken, NFTContract, addr1, owner;
    
        [owner, addr1] = await hre.ethers.getSigners();
        NFTContract = await hre.ethers.getContractFactory("NFTContract");
        const nftContract = await NFTContract.deploy(owner.address);
    
        ForgeToken = await hre.ethers.getContractFactory("ForgeToken");
        forgeToken = await ForgeToken.deploy(nftContract.target);
    
        await nftContract.setForgeContract(forgeToken.target);
    
        return { forgeToken, nftContract, addr1, owner };
    }



    it("should forge tokens", async function () {
        const { forgeToken, nftContract, addr1, owner } = await loadFixture(deployForgeFixture);
        await nftContract.connect(owner).mint(0);
        await time.increase(61);
        await nftContract.connect(owner).mint(1);

        const initialBalance0 = await nftContract.balanceOf(owner.address, 0);
        const initialBalance1 = await nftContract.balanceOf(owner.address, 1);
        const initialBalance2 = await nftContract.balanceOf(owner.address, 2);

        await forgeToken.connect(owner).ForgeTokenById(3, 1);

        const finalBalance0 = await nftContract.balanceOf(owner.address, 0);
        const finalBalance1 = await nftContract.balanceOf(owner.address, 1);
        const finalBalance2 = await nftContract.balanceOf(owner.address, 2);
        const finalBalance3 = await nftContract.balanceOf(owner.address, 3);

        expect(finalBalance0).to.equal(initialBalance0 - BigInt(1));
        expect(finalBalance1).to.equal(initialBalance1 - BigInt(1));
        expect(finalBalance2).to.equal(initialBalance2);
        expect(finalBalance3).to.equal(BigInt(1));
    });

    it("should not forge invalid tokens", async function () {
        const { forgeToken, addr1, owner } = await loadFixture(deployForgeFixture);
        await expect(forgeToken.connect(owner).ForgeTokenById(0, 1)).to.be.revertedWith(
            "This token can only be minted not forged"
        );
    });

    it("should trade tokens", async function () {
        const { forgeToken, nftContract, addr1, owner } = await loadFixture(deployForgeFixture);

        await nftContract.connect(owner).mint(0);


        const initialBalance0 = await nftContract.balanceOf(owner.address, BigInt(0));
        const initialBalance1 = await nftContract.balanceOf(owner.address, BigInt(1));


        await forgeToken.connect(owner).tradeToken(0, 1, 1);

        const finalBalance0 = await nftContract.balanceOf(owner.address, BigInt(0));
        const finalBalance1 = await nftContract.balanceOf(owner.address, BigInt(1));

        expect(finalBalance0).to.equal(initialBalance0 -  BigInt(1));
        expect(finalBalance1).to.equal(initialBalance1 + BigInt(1));
    });

});