const { ethers } = require("hardhat");
const { assert } = require("chai");
const { BigNumber } = ethers;

describe("BatchDeposit", function () {
  let accounts;
  let contract;

  before(async () => {
    accounts = await ethers.getSigners();
    const BatchDeposit = await ethers.getContractFactory("BatchDeposit");
    contract = await BatchDeposit.deploy();
    await contract.deployed();
  });

  it("initial fee should be 1 gwei", async () => {
    const currentFee = await contract.fee();
    assert.equal(currentFee.toString(), ethers.utils.parseUnits("1", "gwei").toString());
  });

  it("should change fee", async () => {
    const currentFee = await contract.fee();
    const newFee = ethers.utils.parseEther("1");

    const tx = await contract.connect(accounts[0]).changeFee(newFee);
    const receipt = await tx.wait();

    assert.equal(receipt.events?.length, 1, "events are not 1 as expected!");

    const updatedFee = await contract.fee();
    assert.equal(updatedFee.toString(), newFee.toString(), "new fee is not set correctly");
    assert.notEqual(currentFee.toString(), updatedFee.toString(), "new fee is not set correctly");
  });

  it("should not change fee", async () => {
    const newFee = ethers.utils.parseEther("2");

    await assert.revert(
      contract.connect(accounts[2]).changeFee(newFee),
      "Ownable: caller is not the owner"
    );
  });

  it("should not renounce ownership", async () => {
    await assert.revert(
      contract.connect(accounts[0]).renounceOwnership(),
      "Ownable: renounceOwnership is disabled"
    );
  });
});
