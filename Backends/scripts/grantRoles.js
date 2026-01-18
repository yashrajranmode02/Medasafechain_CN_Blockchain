// scripts/grantRoles.js
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const abiPath = path.resolve(
  __dirname,
  "../../blockchain/artifacts/contracts/BatchRegistry.sol/BatchRegistry.json"
);
const batchABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

// Env vars
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const MANUFACTURER_KEY = process.env.MANUFACTURER_KEY;
const DISTRIBUTOR_KEY = process.env.DISTRIBUTOR_KEY;

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const manufacturer = new ethers.Wallet(MANUFACTURER_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, batchABI.abi, manufacturer);

  const distributorWallet = new ethers.Wallet(DISTRIBUTOR_KEY, provider);
  const distributorAddress = await distributorWallet.getAddress();

  console.log(`Granting DISTRIBUTOR_ROLE to ${distributorAddress}...`);

  // Directly compute role constant
  const DISTRIBUTOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("DISTRIBUTOR_ROLE"));

  const tx = await contract.grantRole(DISTRIBUTOR_ROLE, distributorAddress);
  await tx.wait();

  console.log("✅ Distributor role granted successfully!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
});
