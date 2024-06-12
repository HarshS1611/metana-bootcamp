const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("hardhat");



describe("ForgeTokenContract", function () {
    async function deployForgeFixture() {
        let ForgeToken, forgeToken, addr1, owner;

        [owner, addr1] = await hre.ethers.getSigners();

        ForgeToken = await hre.ethers.getContractFactory("ForgeToken");
        forgeToken = await ForgeToken.deploy(owner.address);

        return { forgeToken, addr1, owner };
    }
    describe("ForgeToken", function () {


        it("should forge tokens", async function () {
            const { forgeToken, addr1 } = await loadFixture(deployForgeFixture);
            await forgeToken.connect(addr1).freeMint(0);
            await time.increase(61);
            await forgeToken.connect(addr1).freeMint(1);

            const initialBalance0 = await forgeToken.balanceOf(addr1.address, 0);
            const initialBalance1 = await forgeToken.balanceOf(addr1.address, 1);
            const initialBalance2 = await forgeToken.balanceOf(addr1.address, 2);

            await forgeToken.connect(addr1).ForgeTokenById(3);

            const finalBalance0 = await forgeToken.balanceOf(addr1.address, 0);
            const finalBalance1 = await forgeToken.balanceOf(addr1.address, 1);
            const finalBalance2 = await forgeToken.balanceOf(addr1.address, 2);
            const finalBalance3 = await forgeToken.balanceOf(addr1.address, 3);

            expect(finalBalance0).to.equal(initialBalance0 - BigInt(1));
            expect(finalBalance1).to.equal(initialBalance1 - BigInt(1));
            expect(finalBalance2).to.equal(initialBalance2);
            expect(finalBalance3).to.equal(BigInt(1));
        });

        it("should not forge invalid tokens", async function () {
            const { forgeToken, addr1 } = await loadFixture(deployForgeFixture);
            await expect(forgeToken.connect(addr1).ForgeTokenById(0)).to.be.revertedWith(
                "This token can only be minted not forged"
            );
        });

    });

    describe("Mint Token", function () {
        it("should mint tokens", async function () {
            const { forgeToken, addr1 } = await loadFixture(deployForgeFixture);
            await forgeToken.connect(addr1).freeMint(0);
            await time.increase(61);
            await forgeToken.connect(addr1).freeMint(1);

            const initialBalance0 = await forgeToken.balanceOf(addr1.address, 0);
            const initialBalance1 = await forgeToken.balanceOf(addr1.address, 1);

            time.increase(62);

            await forgeToken.connect(addr1).freeMint(2);

            const finalBalance0 = await forgeToken.balanceOf(addr1.address, 0);
            const finalBalance1 = await forgeToken.balanceOf(addr1.address, 1);
            const finalBalance2 = await forgeToken.balanceOf(addr1.address, 2);

            expect(finalBalance0).to.equal(initialBalance0);
            expect(finalBalance1).to.equal(initialBalance1);
            expect(finalBalance2).to.equal(BigInt(1));
        });

        it("should not mint invalid tokens", async function () {
            const { forgeToken, addr1 } = await loadFixture(deployForgeFixture);
            await expect(forgeToken.connect(addr1).freeMint(3)).to.be.revertedWith(
                "This token can only be forged not minted"
            );
        });


        it("should not mint if time elapsed is less than 1 minute", async function () {
            const { forgeToken, owner, addr1, addr2 } = await loadFixture(deployForgeFixture);
            await forgeToken.connect(addr1).freeMint(0);
            await expect(forgeToken.connect(addr1).freeMint(0)).to.be.revertedWith(
                "Cannot mint token yet."
            );
        });

    }
    );

    describe("Trade Token", function () {
        it("should trade tokens", async function () {
            const { forgeToken, addr1 } = await loadFixture(deployForgeFixture);

            await forgeToken.connect(addr1).freeMint(0);


            const initialBalance0 = await forgeToken.balanceOf(addr1.address, BigInt(0));
            const initialBalance1 = await forgeToken.balanceOf(addr1.address, BigInt(1));


            await forgeToken.connect(addr1).tradeToken(0, 1);

            const finalBalance0 = await forgeToken.balanceOf(addr1.address, BigInt(0));
            const finalBalance1 = await forgeToken.balanceOf(addr1.address, BigInt(1));

            expect(finalBalance0).to.equal(initialBalance0 - BigInt(1));
            expect(finalBalance1).to.equal(initialBalance1 + BigInt(1));
        });

        it("should not trade same tokens", async function () {
            const { forgeToken, addr1 } = await loadFixture(deployForgeFixture);
            await expect(forgeToken.connect(addr1).tradeToken(1, 1)).to.be.revertedWith(
                "Cannot trade same token"
            );
        });
    });

    describe("URI", function () {

        it("should set token URI", async function () {
            const { forgeToken, owner, addr1, addr2 } = await loadFixture(deployForgeFixture);
            const uri = "https://example.com/token/{id}.json";
            await forgeToken.connect(owner).setTokenUri(0, uri);
            expect(await forgeToken.uri(0)).to.equal(uri);
        });

        it("should not set token URI twice", async function () {
            const { forgeToken, owner, addr1, addr2 } = await loadFixture(deployForgeFixture);
            const uri = "https://example.com/token/{id}.json";
            await forgeToken.connect(owner).setTokenUri(0, uri);
            await expect(forgeToken.connect(owner).setTokenUri(0, uri)).to.be.revertedWith(
                "Cannot set uri twice"
            );
        });

        it("should not set token URI if not owner", async function () {
            const { forgeToken, owner, addr1, addr2 } = await loadFixture(deployForgeFixture);
            const uri = "https://example.com/token/{id}.json";
            await expect(forgeToken.connect(addr1).setTokenUri(0, uri)).to.be.reverted;
        });
    });
});
