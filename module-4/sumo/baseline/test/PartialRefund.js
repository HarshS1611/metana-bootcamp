const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const ethers = require('ethers');
const hre = require("hardhat");



describe("PartialRefund", function () {
    async function deployPartialRefundFixture() {
        const [owner, nonOwner] = await hre.ethers.getSigners();

        const PartialRefund = await hre.ethers.getContractFactory("PartialRefund");

        const partialRefundContract = await PartialRefund.deploy(owner.address);


        return { partialRefundContract, owner, nonOwner };
    }


    describe("BuyTokens", function () {
        it("Should allow buying tokens with ether", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            const etherAmount = hre.ethers.parseEther("1");
            await partialRefundContract.connect(nonOwner).buyTokens({ value: etherAmount });
        });

        it("Should revert when buying tokens with less than the minimum amount", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            const etherAmount = hre.ethers.parseEther("0");
            await expect(partialRefundContract.connect(nonOwner).buyTokens({ value: etherAmount })).to.be.reverted;
        }
        );
    });

    describe("SellBack", function () {
        it("Should revert when selling more tokens than the user balance", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            const etherAmount = hre.ethers.parseEther("1000");
            await expect(partialRefundContract.connect(nonOwner).sellBack(etherAmount)).to.be.revertedWith(
                "Insufficient token balance"
            );
        });

        it("Should allow selling tokens back to the contract", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            [add1] = await hre.ethers.getSigners();
            const etherAmount = hre.ethers.parseEther("1");
            const expectedRefundAmount = hre.ethers.parseEther("0.5");
            const sellAmount = hre.ethers.parseEther("1000");

            await partialRefundContract.connect(nonOwner).buyTokens({ value: etherAmount });

            await partialRefundContract.connect(nonOwner).sellBack(sellAmount);
            const contractBalanceAfter = await hre.ethers.provider.getBalance(partialRefundContract.target);

            expect(contractBalanceAfter).to.greaterThanOrEqual(expectedRefundAmount);
        });
    });

    describe("WithdrawEther", function () {
        it("Should revert when withdrawing more ether than the contract balance", async function () {
            const { partialRefundContract, owner } = await loadFixture(deployPartialRefundFixture);
            const withdrawAmount = hre.ethers.parseEther("1000001");

            await expect(partialRefundContract.connect(owner).withdrawEther(withdrawAmount, owner.address)).to.be.revertedWith(
                "Insufficient balance"
            );
        });
        it("Should not allow non-owners to withdraw ether", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            const withdrawAmount = hre.ethers.parseEther("1");

            await expect(partialRefundContract.connect(nonOwner).withdrawEther(withdrawAmount, nonOwner.address)).to.be.reverted;
        });
    });
});