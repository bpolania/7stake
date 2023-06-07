const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("BatchDeposit", function () {
  let accounts;
  let contract;

  before(async () => {
    accounts = await ethers.getSigners();
    const BatchDeposit = await ethers.getContractFactory("BatchDeposit");
    contract = await BatchDeposit.deploy();
    await contract.deployed();
  });

  it("should not pause contract", async () => {
    await assert.revert(
      contract.connect(accounts[2]).pause(),
      "Ownable: caller is not the owner"
    );
  });

  it("should pause the contract", async () => {
    const tx = await contract.connect(accounts[0]).pause();
    const receipt = await tx.wait();

    assert.equal(receipt.events?.length, 1, "events are not 1 as expected!");

    const paused = await contract.paused();
    assert.equal(paused, true, "contract is not paused");
  });

  it("should not deposit if contract is paused", async () => {
    await assert.revert(
      contract.connect(accounts[1]).batchDeposit(
        ["0x00000", "0x00000"],
        "0x00000",
        ["0x00000", "0x00000"],
        ["0x00000", "0x00000"],
        {
          value: ethers.utils.parseEther("0.001"),
        }
      ),
      "Pausable: paused"
    );
  });

  it("should not unpause contract", async () => {
    await assert.revert(
      contract.connect(accounts[2]).unpause(),
      "Ownable: caller is not the owner"
    );
  });

  it("should unpause the contract", async () => {
    const tx = await contract.connect(accounts[0]).unpause();
    const receipt = await tx.wait();

    assert.equal(receipt.events?.length, 1, "events are not 1 as expected!");

    const paused = await contract.paused();
    assert.equal(paused, false, "contract is not unpaused");
  });
});
