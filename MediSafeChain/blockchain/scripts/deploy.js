import hre from "hardhat";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🚀 Deploying BatchRegistry...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);

  const BatchRegistry = await hre.ethers.getContractFactory("BatchRegistry");
  const registry = await BatchRegistry.deploy(deployer.address);
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  console.log("✅ Deployed at:", contractAddress);

  // Save contract address to .env
  const envPath = path.join(__dirname, "..", ".env");
  let envContent = fs.readFileSync(envPath, "utf8");
  envContent = envContent.replace(/CONTRACT_ADDRESS=.*/m, `CONTRACT_ADDRESS=${contractAddress}`);
  fs.writeFileSync(envPath, envContent);

  console.log("📝 Updated .env with CONTRACT_ADDRESS");
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
