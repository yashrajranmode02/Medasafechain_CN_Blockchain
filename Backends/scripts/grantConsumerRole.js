// scripts/grantConsumerRole.js
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

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const MANUFACTURER_KEY = process.env.MANUFACTURER_KEY;
const CONSUMER_KEY = process.env.CONSUMER_KEY;

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const manufacturer = new ethers.Wallet(MANUFACTURER_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, batchABI.abi, manufacturer);

  const consumerWallet = new ethers.Wallet(CONSUMER_KEY, provider);
  const consumerAddress = await consumerWallet.getAddress();

  console.log(`Granting CHEMIST_ROLE (Consumer) to ${consumerAddress}...`);

  const CHEMIST_ROLE = ethers.keccak256(ethers.toUtf8Bytes("CHEMIST_ROLE"));

  const tx = await contract.grantRole(CHEMIST_ROLE, consumerAddress);
  await tx.wait();

  console.log("✅ Consumer (Chemist) role granted successfully!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
});
