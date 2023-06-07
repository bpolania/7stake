const { ethers } = require("hardhat");
const { assert } = require("chai");
const { BigNumber } = ethers;

// 1 gwei fee
const fee = ethers.utils.parseUnits("1", "gwei");

describe("BatchDeposit", function () {
  let accounts;
  let batchContract;

  before(async () => {
    accounts = await ethers.getSigners();
    const DepositContract = await ethers.getContractFactory("DepositContract");
    const depositContract = await DepositContract.deploy();
    await depositContract.deployed();

    const BatchDeposit = await ethers.getContractFactory("BatchDeposit");
    batchContract = await BatchDeposit.deploy(depositContract.address, fee);
    await batchContract.deployed();
  });

  it("initial fee should be 1 gwei", async () => {
    const currentFee = await batchContract.fee();
    assert.equal(currentFee.toString(), ethers.utils.parseUnits("1", "gwei").toString());
  });

  it("should change fee", async () => {
    const currentFee = await batchContract.fee();
    const newFee = ethers.utils.parseEther("1");

    const tx = await batchContract.connect(accounts[0]).changeFee(newFee);
    const receipt = await tx.wait();

    assert.equal(receipt.events?.length, 1, "events are not 1 as expected!");

    const updatedFee = await batchContract.fee();
    assert.equal(updatedFee.toString(), newFee.toString(), "new fee is not set correctly");
    assert.notEqual(currentFee.toString(), updatedFee.toString(), "new fee is not set correctly");
  });

  it("should not change fee", async () => {
    const newFee = ethers.utils.parseEther("2");

    await assert(
      batchContract.connect(accounts[2]).changeFee(newFee),
      "Ownable: caller is not the owner"
    );
  });

  it("should not renounce ownership", async () => {
    await assert(
      batchContract.connect(accounts[0]).renounceOwnership(),
      "Ownable: renounceOwnership is disabled"
    );
  });
});
