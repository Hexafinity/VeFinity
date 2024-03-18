const hre = require("hardhat");

async function main() {
  // Deploying the HexaFinity contract
  const hexaFinity = await hre.ethers.deployContract("HexaFinity");

  await hexaFinity.waitForDeployment();
console.log(hexaFinity.target)
  console.log("HexaFinity deployed to:", hexaFinity.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
