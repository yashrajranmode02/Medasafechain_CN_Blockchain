import hre from "hardhat";

async function main() {
  console.log("🚀 Starting BatchRegistry deployment...");
  
  try {
    // Use hardhat-ethers plugin directly
    const signers = await hre.ethers.getSigners();
    const deployer = signers[0];
    console.log("📝 Deploying with account:", deployer.address);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
    
    // Deploy contract
    const BatchRegistry = await hre.ethers.getContractFactory("BatchRegistry");
    console.log("⏳ Deploying BatchRegistry contract...");
    
    const batchRegistry = await BatchRegistry.deploy();
    await batchRegistry.waitForDeployment();
    
    const contractAddress = await batchRegistry.getAddress();
    console.log("✅ BatchRegistry deployed to:", contractAddress);
    
    // Test the contract
    console.log("🧪 Testing deployed contract...");
    const initialCount = await batchRegistry.getBatchCount();
    console.log("Initial batch count:", initialCount.toString());
    
    console.log("🎉 Deployment completed successfully!");
    console.log("📋 Summary:");
    console.log(`   - Contract: BatchRegistry`);
    console.log(`   - Address: ${contractAddress}`);
    console.log(`   - Network: ${hre.network.name}`);
    
    console.log(`\\n🔧 Add this to your .env file:`);
    console.log(`BATCH_REGISTRY_ADDRESS=${contractAddress}`);
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });