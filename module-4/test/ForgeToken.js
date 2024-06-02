const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require("hardhat");


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
        let ForgeToken, forgeToken, NFTContract, addr1;
        [addr1] = await hre.ethers.getSigners(); 
        NFTContract = await hre.ethers.getContractFactory("NFTContract");
        const nftContract = await NFTContract.deploy(addr1.address);

        ForgeToken = await hre.ethers.getContractFactory("ForgeToken"); 
        forgeToken = await ForgeToken.deploy(nftContract.address);

        return { forgeToken, nftContract, addr1 };
    };

    it("should forge tokens", async function () {
        const { forgeToken, nftContract, addr1 } = await loadFixture(deployForgeFixture);
        await nftContract.connect(addr1).mint(0);
        await nftContract.connect(addr1).mint(1);
        await nftContract.connect(addr1).mint(2);

        const initialBalance0 = await nftContract.balanceOf(addr1.address, 0);
        const initialBalance1 = await nftContract.balanceOf(addr1.address, 1);
        const initialBalance2 = await nftContract.balanceOf(addr1.address, 2);

        await forgeToken.connect(addr1).ForgeTokenById(3, 1);

        const finalBalance0 = await nftContract.balanceOf(addr1.address, 0);
        const finalBalance1 = await nftContract.balanceOf(addr1.address, 1);
        const finalBalance2 = await nftContract.balanceOf(addr1.address, 2);
        const finalBalance3 = await nftContract.balanceOf(addr1.address, 3);

        expect(finalBalance0).to.equal(initialBalance0 - 1);
        expect(finalBalance1).to.equal(initialBalance1 - 1);
        expect(finalBalance2).to.equal(initialBalance2);
        expect(finalBalance3).to.equal(1);
    });

    it("should not forge invalid tokens", async function () {
        const { forgeToken, addr1 } = await loadFixture(deployForgeFixture);
        console.log(addr1)
        await expect(forgeToken.connect(addr1).ForgeTokenById(0, 1)).to.be.revertedWith(
            "This token can only be minted not forged"
        );
    });

    it("should trade tokens", async function () {
        const { forgeToken, nftContract, addr1 } = await loadFixture(deployForgeFixture);

        await nftContract.connect(addr1).mint(0);
        await nftContract.connect(addr1).mint(1);
        await nftContract.connect(addr1).mint(2);

        const initialBalance0 = await nftContract.balanceOf(addr1.address, 0);
        const initialBalance1 = await nftContract.balanceOf(addr1.address, 1);
        const initialBalance2 = await nftContract.balanceOf(addr1.address, 2);

        await forgeToken.connect(addr1).tradeToken(0, 1, 1);

        const finalBalance0 = await nftContract.balanceOf(addr1.address, 0);
        const finalBalance1 = await nftContract.balanceOf(addr1.address, 1);
        const finalBalance2 = await nftContract.balanceOf(addr1.address, 2);

        expect(finalBalance0).to.equal(initialBalance0 - 1);
        expect(finalBalance1).to.equal(initialBalance1 + 1);
        expect(finalBalance2).to.equal(initialBalance2);
    });

});