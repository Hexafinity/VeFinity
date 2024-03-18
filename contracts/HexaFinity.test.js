const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HexaFinity Token Contract", function () {
  let HexaFinity;
  let hexaFinity;
  let owner;
  let addr1;
  let addr2;
  let taxReceiver;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    HexaFinity = await ethers.getContractFactory("HexaFinity");
    [owner, addr1, addr2, taxReceiver] = await ethers.getSigners();

    // Deploy a new HexaFinity contract for each test
    hexaFinity = await HexaFinity.deploy();
    await hexaFinity.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hexaFinity.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hexaFinity.balanceOf(owner.address);
      expect(await hexaFinity.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts with tax and burn", async function () {
      // Transfer 1000 tokens from owner to addr1
      const transferAmount = ethers.utils.parseEther("1000");
      const taxFee = transferAmount.mul(2).div(1000); // 0.2%
      const burnFee = transferAmount.div(1000); // 0.1%
      const amountAfterFees = transferAmount.sub(taxFee).sub(burnFee);

      await hexaFinity.transfer(addr1.address, transferAmount);

      // Check balances after transfer
      expect(await hexaFinity.balanceOf(addr1.address)).to.equal(amountAfterFees);
      expect(await hexaFinity.balanceOf(taxReceiver.address)).to.equal(taxFee);

      // Total supply should decrease by burnFee
      const totalSupplyAfterBurn = await hexaFinity.totalSupply();
      expect(totalSupplyAfterBurn).to.equal(INITIAL_SUPPLY.sub(burnFee));
    });

    it("Should correctly handle the tax and burn on transferFrom", async function () {
      // Owner approves addr1 to spend on their behalf
      const transferAmount = ethers.utils.parseEther("500");
      await hexaFinity.approve(addr1.address, transferAmount);

      const taxFee = transferAmount.mul(2).div(1000); // 0.2%
      const burnFee = transferAmount.div(1000); // 0.1%
      const amountAfterFees = transferAmount.sub(taxFee).sub(burnFee);

      // addr1 transfers on behalf of owner to addr2
      await hexaFinity.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);

      // Check balances after transferFrom
      expect(await hexaFinity.balanceOf(addr2.address)).to.equal(amountAfterFees);
      expect(await hexaFinity.balanceOf(taxReceiver.address)).to.equal(taxFee);

      // Total supply should decrease by burnFee
      const totalSupplyAfterBurn = await hexaFinity.totalSupply();
      expect(totalSupplyAfterBurn).to.equal(INITIAL_SUPPLY.sub(burnFee));
    });
  });
});
