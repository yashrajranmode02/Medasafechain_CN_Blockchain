import hre from "hardhat";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🚀 Starting MediSafeChain Deployment...");

  const [deployer, distributor] = await hre.ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("🚚 Distributor:", distributor.address);

  // === STEP 1: Deploy contract ===
  const BatchRegistry = await hre.ethers.getContractFactory("BatchRegistry");
  const registry = await BatchRegistry.deploy(deployer.address);
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  console.log("✅ Deployed at:", contractAddress);

  // === STEP 2: Save address to .env ===
  const envPath = path.join(__dirname, "..", ".env");
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  if (!envContent.includes("CONTRACT_ADDRESS=")) envContent += "\nCONTRACT_ADDRESS=\n";
  envContent = envContent.replace(/CONTRACT_ADDRESS=.*/m, `CONTRACT_ADDRESS=${contractAddress}`);
  fs.writeFileSync(envPath, envContent);
  console.log("📝 Updated .env with CONTRACT_ADDRESS");

  // === STEP 3: Create a test batch ===
  console.log("\n📦 Creating demo batch...");
  const batchId = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("DEMO-001"));
  const qrHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("QRPAYLOAD-DEMO"));

  const tx = await registry.createBatch(batchId, "Paracetamol 500mg", qrHash, deployer.address);
  await tx.wait();
  console.log("✅ Batch created with ID hash:", batchId);

  // === STEP 4: Fetch batch details ===
  const details = await registry.getBatchDetails(batchId);
  console.log("\n📋 Batch Details:");
  console.log("Medicine Name:", details[1]);
  console.log("Manufacturer:", details[2]);
  console.log("Created At:", new Date(Number(details[3]) * 1000).toLocaleString());
  console.log("Status:", details[4]);
  console.log("QR Hash:", details[5]);

  console.log("\n🎉 Deployment and test completed successfully!");
}

main().catch((error) => {
  console.error("❌ Error in deployment:", error);
  process.exit(1);
});
