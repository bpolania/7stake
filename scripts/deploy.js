const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // 1 gwei fee
  const fee = ethers.utils.parseUnits("1", "gwei");

  accounts = await ethers.getSigners();
  const DepositContract = await ethers.getContractFactory("DepositContract");
  const depositContract = await DepositContract.deploy();
  await depositContract.deployed();
  console.log("DepositContract deployed to:", depositContract.address);

  const BatchDeposit = await ethers.getContractFactory("BatchDeposit");
  batchContract = await BatchDeposit.deploy(depositContract.address, fee);
  await batchContract.deployed();

  console.log("BatchDeposit deployed to:", batchContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });