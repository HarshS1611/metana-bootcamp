const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("hardhat");


describe("NFT SALE", function () {

  async function deployForgeFixture() {

    let AdvancedNFT, AdvancedNFTContract, owner, otherAccount;

    [owner, otherAccount] = await hre.ethers.getSigners();

    AdvancedNFT = await hre.ethers.getContractFactory("AdvancedNFT");
    AdvancedNFTContract = await AdvancedNFT.deploy();

    return { AdvancedNFTContract, owner, otherAccount };
  }

  it("Should not allow to buy NFTs if not started", async function () {
    const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
    const etherAmount = hre.ethers.parseEther("1");
    await expect( AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount })).to.be.revertedWith("Invalid state");
  });

  it("Should allow to buy NFTs when sale is started", async function () {
    const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
    const etherAmount = hre.ethers.parseEther("1");

    await AdvancedNFTContract.connect(owner).setState(2);
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount});
    expect(await AdvancedNFTContract.balanceOf(owner.address)).to.equal(1);
  });

  it("Should not allow to buy NFTs when sale is ended", async function () {
    const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
    const etherAmount = hre.ethers.parseEther("1");

    await AdvancedNFTContract.connect(owner).setState(3);
    await expect( AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount })).to.be.revertedWith("Invalid state");
  });

  it("Token Ids should not collide", async function () {
    const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
    const etherAmount = hre.ethers.parseEther("1");

    await AdvancedNFTContract.connect(owner).setState(2);
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount});
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount});
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount});
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount});
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount});
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount});
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount});
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount});
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount});
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount});

    expect(await AdvancedNFTContract.tokenCount()).to.equal(10);
    expect(await AdvancedNFTContract.balanceOf(owner.address)).to.equal(10);
    expect(await AdvancedNFTContract.availableTokenCount()).to.equal(0);
    expect(await AdvancedNFTContract.currentState()).to.equal(3);
    
  });
});