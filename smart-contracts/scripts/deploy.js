const { ethers } = require("hardhat");

async function main() {
  const waveContractFactory = await ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: ethers.utils.parseEther("0.0001"),
  });

  await waveContract.deployed(); //0xeE3AA8301a805327aCcaBd276F6E2EE2cee09Bac

  //const [deployer] = await hre.ethers.getSigners();

  //console.log("Deploying contracts with account: ", deployer.address);
  console.log("WavePortal address:", waveContract.address);

  console.log("Veryfing contract address", waveContract.address);

  console.log("Sleeping...");
  // Buffer a time for etherscan to update the deployed contract
  await sleep(30000);

  //Verify contract
  await hre.run("verify:verify", {
    address: waveContract.address,
    // constructorArguments: [],
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
