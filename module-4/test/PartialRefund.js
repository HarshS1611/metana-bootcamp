const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");

describe("PartialRefund", function () {
    async function deployPartialRefundFixture() {
        const [owner, nonOwner] = await hre.ethers.getSigners();
        const PartialRefund = await hre.ethers.getContractFactory("PartialRefund");
        const partialRefundContract = await PartialRefund.deploy(owner.address);

        const RevertingReceiver = await hre.ethers.getContractFactory("RevertingReceiver");
        const revertingReceiver = await RevertingReceiver.deploy();

        return { partialRefundContract, revertingReceiver, owner, nonOwner };
    }
    describe("BuyTokens", function () {
        it("Should allow buying tokens with ether", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            const etherAmount = hre.ethers.parseEther("1");
            await expect(partialRefundContract.connect(nonOwner).buyTokens({ value: etherAmount }))
                .to.changeEtherBalance(partialRefundContract, etherAmount);
            const balance = await partialRefundContract.balanceOf(nonOwner.address);
            expect(balance).to.equal(hre.ethers.parseEther("1000"));
        });

        it("Should revert when buying tokens with zero ether", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            await expect(partialRefundContract.connect(nonOwner).buyTokens({ value: 0 })).to.be.revertedWith("You need to send some ether");
        });


        it("should not mint if MAX tokens minted", async function () {
            const { partialRefundContract, owner } = await loadFixture(deployPartialRefundFixture);
            const etherAmount = hre.ethers.parseEther("999");
            await partialRefundContract.connect(owner).buyTokens({ value: etherAmount });
            await expect(partialRefundContract.connect(owner).buyTokens({ value: etherAmount })).to.be.reverted;
        });
    });

    describe("SellBack", function () {
        it("Should revert when selling more tokens than balance", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            await expect(partialRefundContract.connect(nonOwner).sellBack(hre.ethers.parseEther("1000"))).to.be.revertedWith("Insufficient token balance");
        });

        it("Should allow selling tokens back to the contract", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            const etherAmount = hre.ethers.parseEther("1");
            const sellAmount = hre.ethers.parseEther("1000");
            const refundAmount = hre.ethers.parseEther("0.5");

            await partialRefundContract.connect(nonOwner).buyTokens({ value: etherAmount });
            const initialBalance = await hre.ethers.provider.getBalance(partialRefundContract.target);
            await partialRefundContract.connect(nonOwner).sellBack(sellAmount);
            const finalBalance = await hre.ethers.provider.getBalance(partialRefundContract.target);
            expect(initialBalance).to.equal(etherAmount);
            expect(finalBalance).to.equal(refundAmount);
        });



    });

    describe("WithdrawEther", function () {
        it("Should revert when withdrawing more ether than contract balance", async function () {
            const { partialRefundContract, owner } = await loadFixture(deployPartialRefundFixture);
            const withdrawAmount = hre.ethers.parseEther("1000001");
            await expect(partialRefundContract.connect(owner).withdrawEther(withdrawAmount, owner.address)).to.be.revertedWith("Insufficient balance");
        });

        it("Should not allow non-owners to withdraw ether", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            const withdrawAmount = hre.ethers.parseEther("1");
            await expect(partialRefundContract.connect(nonOwner).withdrawEther(withdrawAmount, nonOwner.address)).to.be.reverted;
        });

        it("Should allow owners to withdraw ether", async function () {
            const { partialRefundContract, owner, nonOwner } = await loadFixture(deployPartialRefundFixture);
            const etherAmount = hre.ethers.parseEther("1");
            await partialRefundContract.connect(nonOwner).buyTokens({ value: etherAmount });
            const initialBalance = await hre.ethers.provider.getBalance(partialRefundContract.target);

            await expect(partialRefundContract.connect(owner).withdrawEther(etherAmount, owner.address))
                .to.changeEtherBalance(owner, etherAmount);
            const finalBalance = await hre.ethers.provider.getBalance(partialRefundContract.target);
            expect(initialBalance).to.equal(etherAmount);
            expect(finalBalance).to.equal(0);
        });


        it("Should revert when target contract rejects ether transfer", async function () {
            const { partialRefundContract, owner, revertingReceiver } = await loadFixture(deployPartialRefundFixture);
            const etherAmount = hre.ethers.parseEther("1");
            await partialRefundContract.connect(owner).buyTokens({ value: etherAmount });
            await expect(partialRefundContract.connect(owner).withdrawEther(etherAmount, revertingReceiver.target)).to.be.revertedWith("Transfer failed");
        });

    });
});
