// Simple deployment for BatchRegistry using Hardhat 3.x
// Run with: npx hardhat run deploy-simple.js

const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting BatchRegistry deployment...");

  // Compile the contracts first
  await hre.run('compile');
  
  // Use Hardhat's built-in deployment
  const BatchRegistry = await hre.ethers.getContractFactory("BatchRegistry");
  const batchRegistry = await BatchRegistry.deploy();
  
  await batchRegistry.deployed();
  
  console.log("✅ BatchRegistry deployed to:", batchRegistry.address);
  
  // Test the contract
  const initialCount = await batchRegistry.getBatchCount();
  console.log("Initial batch count:", initialCount.toString());
  
  console.log("🎉 Deployment completed successfully!");
  
  // Save address to console for manual update
  console.log(`\nUpdate your .env file with:\nBATCH_REGISTRY_ADDRESS=${batchRegistry.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });