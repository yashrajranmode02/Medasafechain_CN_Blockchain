import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🚀 Starting BatchRegistry deployment...");
  
  try {
    // Create provider for hardhat network
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    
    // Create wallet from hardhat's first test account
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log("📝 Deploying with account:", wallet.address);
    
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
    
    // Read contract artifact
    const artifactPath = path.join(__dirname, "artifacts", "contracts", "BatchRegistry.sol", "BatchRegistry.json");
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    
    // Create contract factory
    const ContractFactory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    
    console.log("⏳ Deploying BatchRegistry contract...");
    const batchRegistry = await ContractFactory.deploy();
    await batchRegistry.deployed();
    
    const contractAddress = batchRegistry.address;
    console.log("✅ BatchRegistry deployed to:", contractAddress);
    
    // Test the contract
    console.log("🧪 Testing deployed contract...");
    const initialCount = await batchRegistry.getBatchCount();
    console.log("Initial batch count:", initialCount.toString());
    
    console.log("🎉 Deployment completed successfully!");
    console.log("📋 Summary:");
    console.log(`   - Contract: BatchRegistry`);
    console.log(`   - Address: ${contractAddress}`);
    console.log(`   - Network: Hardhat Local`);
    
    // Update .env file
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
      /BATCH_REGISTRY_ADDRESS=.*$/m,
      `BATCH_REGISTRY_ADDRESS=${contractAddress}`
    );
    fs.writeFileSync(envPath, envContent);
    console.log("📝 Contract address saved to .env file");
    
    return contractAddress;
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

main()
  .then((address) => {
    console.log(`\\n🎯 Deployment successful! Contract address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });