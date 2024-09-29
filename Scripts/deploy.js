const { ethers } = require("hardhat");

async function main() {
  const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
  const crowdFunding = await CrowdFunding.deploy(1000); // Pass the target amount here (e.g., 1000 wei)
  await crowdFunding.deployed();

  console.log("CrowdFunding deployed to:", crowdFunding.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
