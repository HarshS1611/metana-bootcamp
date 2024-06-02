const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const ethers = require('ethers');
const hre = require("hardhat");



describe("PartialRefund", function () {
    async function deployPartialRefundFixture() {
        const [owner, nonOwner] = await hre.ethers.getSigners();
        const initialSupply = 10000;

        const PartialRefund = await hre.ethers.getContractFactory("PartialRefund");

        const partialRefundContract = await PartialRefund.deploy(initialSupply, owner.address);


        return { partialRefundContract, owner, nonOwner, initialSupply };
    }

    describe("Mint", function () {
        it("Should revert when non-owner tries to mint tokens", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);

            await expect(partialRefundContract.connect(nonOwner).mint(nonOwner.address, 1000))
                .to.be.reverted;
        });
    });

    describe("BuyTokens", function () {
        it("Should allow buying tokens with ether", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            const etherAmount = hre.ethers.parseEther("1");
            const buyTx = await partialRefundContract.connect(nonOwner).buyTokens({ value: etherAmount });
            await expect(partialRefundContract.connect(nonOwner).mint(nonOwner.address, 1000)).to.be.reverted;
        });
    });

    describe("SellBack", function () {
        it("Should revert when selling more tokens than the user balance", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);

            await expect(partialRefundContract.connect(nonOwner).sellBack(1000)).to.be.revertedWith(
                "Insufficient token balance"
            );
        });

        it("Should allow selling tokens back to the contract", async function () {
            const { partialRefundContract, nonOwner } = await loadFixture(deployPartialRefundFixture);
            [add1] = await hre.ethers.getSigners();
            const etherAmount = hre.ethers.parseEther("1");
            const expectedRefundAmount = hre.ethers.parseEther("0.5");
            const sellAmount = 1000;

            await partialRefundContract.connect(nonOwner).buyTokens({ value: etherAmount });
            const userBalanceBefore = await hre.ethers.provider.getBalance(nonOwner.address);
            const contractBalanceBefore = await hre.ethers.provider.getBalance(partialRefundContract.target);

            const sellTx = await partialRefundContract.connect(nonOwner).sellBack(sellAmount);
            const userBalanceAfter = await hre.ethers.provider.getBalance(nonOwner.address);
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
    });
});