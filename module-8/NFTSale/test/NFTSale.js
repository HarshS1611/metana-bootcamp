const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("hardhat");


describe("NFT PUBLIC SALE", function () {

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
    await expect(AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount })).to.be.revertedWith("Invalid state");
  });

  it("Should allow to buy NFTs when sale is started", async function () {
    const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
    const etherAmount = hre.ethers.parseEther("1");

    await AdvancedNFTContract.connect(owner).setState(2);
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount });
    expect(await AdvancedNFTContract.balanceOf(owner.address)).to.equal(1);
  });

  it("Should not allow to buy NFTs when sale is ended", async function () {
    const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
    const etherAmount = hre.ethers.parseEther("1");

    await AdvancedNFTContract.connect(owner).setState(3);
    await expect(AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount })).to.be.revertedWith("Invalid state");
  });

  it("Token Ids should not collide", async function () {
    const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
    const etherAmount = hre.ethers.parseEther("1");

    await AdvancedNFTContract.connect(owner).setState(2);
    await AdvancedNFTContract.connect(otherAccount).publicMint({ value: etherAmount });
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount });
    await AdvancedNFTContract.connect(otherAccount).publicMint({ value: etherAmount });
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount });
    await AdvancedNFTContract.connect(otherAccount).publicMint({ value: etherAmount });
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount });
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount });
    await AdvancedNFTContract.connect(otherAccount).publicMint({ value: etherAmount });
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount });
    await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount });

    expect(await AdvancedNFTContract.tokenCount()).to.equal(10);
    expect(await AdvancedNFTContract.balanceOf(owner.address)).to.equal(6);
    expect(await AdvancedNFTContract.balanceOf(otherAccount.address)).to.equal(4);
    expect(await AdvancedNFTContract.availableTokenCount()).to.equal(0);
    expect(await AdvancedNFTContract.currentState()).to.equal(3);

  });
});


describe("PRIVATE SALE", function () {

  async function deployForgeFixture() {

    let AdvancedNFT, AdvancedNFTContract, owner, otherAccount;

    [owner, otherAccount] = await hre.ethers.getSigners();

    AdvancedNFT = await hre.ethers.getContractFactory("AdvancedNFT");
    AdvancedNFTContract = await AdvancedNFT.deploy();

    return { AdvancedNFTContract, owner, otherAccount };
  }

  it("Should not allow to buy NFTs if presale not started", async function () {
    const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
    const merkleProof = [
      "0x2f4efd012f30b85c3b205250c3dad4cd9208919ba8889723a8325ec6826f69e1",
      "0xfbd9dfd10273074214b15a83e871923fa9e88f9abd03ab2a7891a42701e72639"
    ];
    await expect(AdvancedNFTContract.connect(owner).presaleMint(1, merkleProof, otherAccount.address)).to.be.revertedWith("Invalid state");
  });

  it("Should allow only owners to buy NFTs when presale is started", async function () {
    const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
    const merkleProof = [
      "0x2f4efd012f30b85c3b205250c3dad4cd9208919ba8889723a8325ec6826f69e1",
      "0xfbd9dfd10273074214b15a83e871923fa9e88f9abd03ab2a7891a42701e72639"
    ];


    await AdvancedNFTContract.connect(owner).setState(1);
    await AdvancedNFTContract.connect(owner).presaleMint(1, merkleProof, "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2");
  });

  it("Should not allow to buy NFTs when presale is ended", async function () {
    const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
    const merkleProof = [
      "0x2f4efd012f30b85c3b205250c3dad4cd9208919ba8889723a8325ec6826f69e1",
      "0xfbd9dfd10273074214b15a83e871923fa9e88f9abd03ab2a7891a42701e72639"
    ];

    await AdvancedNFTContract.connect(owner).setState(3);
    await expect(AdvancedNFTContract.connect(owner).presaleMint(1, merkleProof, "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2")).to.be.revertedWith("Invalid state");
  });

  it("Should not allow to buy NFTs if not whitelisted", async function () {
    const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
    const merkleProof = [
      "0x2f4efd012f30b85c3b205250c3dad4cd9208919ba8889723a8325ec6826f69e1",
      "0xfbd9dfd10273074214b15a83e871923fa9e88f9abd03ab2a7891a42701e72639"
    ];

    await AdvancedNFTContract.connect(owner).setState(1);
    await expect(AdvancedNFTContract.connect(otherAccount).presaleMint(1, merkleProof, "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"));
  });


});

describe("Batch Transfer NFTs", function () {
  
    async function deployForgeFixture() {
  
      let AdvancedNFT, AdvancedNFTContract, owner, otherAccount;
  
      [owner, otherAccount] = await hre.ethers.getSigners();
  
      AdvancedNFT = await hre.ethers.getContractFactory("AdvancedNFT");
      AdvancedNFTContract = await AdvancedNFT.deploy();
  
      return { AdvancedNFTContract, owner, otherAccount };
    }
  
    it("Should allow to batch transfer NFTs", async function () {
      const { AdvancedNFTContract, owner, otherAccount } = await loadFixture(deployForgeFixture);
      const etherAmount = hre.ethers.parseEther("1");
  
      await AdvancedNFTContract.connect(owner).setState(2);

      await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount });
      await AdvancedNFTContract.connect(owner).publicMint({ value: etherAmount });
      
      await AdvancedNFTContract.connect(owner).BatchTokenTransfer([otherAccount.address,otherAccount.address], ["0","1"]);

      expect(await AdvancedNFTContract.balanceOf(owner.address)).to.equal(0);

      expect(await AdvancedNFTContract.balanceOf(otherAccount.address)).to.equal(2);

    });

});
