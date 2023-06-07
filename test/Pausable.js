const { ethers } = require("hardhat");
const { assert } = require("chai");

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

  it("should not pause contract", async () => {
    await assert(
      batchContract.connect(accounts[2]).pause(),
      "Ownable: caller is not the owner"
    );
  });

  it("should pause the contract", async () => {
    const tx = await batchContract.connect(accounts[0]).pause();
    const receipt = await tx.wait();

    assert.equal(receipt.events?.length, 1, "events are not 1 as expected!");

    const paused = await batchContract.paused();
    assert.equal(paused, true, "contract is not paused");
  });

  it("should not deposit if contract is paused", async () => {
    await assert(
      batchContract.connect(accounts[1]).batchDeposit(
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
    await assert(
      batchContract.connect(accounts[2]).unpause(),
      "Ownable: caller is not the owner"
    );
  });

  it("should unpause the contract", async () => {
    const tx = await batchContract.connect(accounts[0]).unpause();
    const receipt = await tx.wait();

    assert.equal(receipt.events?.length, 1, "events are not 1 as expected!");

    const paused = await batchContract.paused();
    assert.equal(paused, false, "contract is not unpaused");
  });
});
