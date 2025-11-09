// // backend/controllers/distributorController.js
// import { ethers } from "ethers";
// import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// dotenv.config();

// // Proper __dirname setup
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ Correct ABI path
// const abiPath = path.resolve(
//   __dirname,
//   "../../blockchain/artifacts/contracts/BatchRegistry.sol/BatchRegistry.json"
// );
// const batchABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

// // Environment
// const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
// const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
// const DISTRIBUTOR_KEY = process.env.DISTRIBUTOR_KEY;

// const provider = new ethers.JsonRpcProvider(RPC_URL);
// const signer = new ethers.Wallet(DISTRIBUTOR_KEY, provider);
// const contract = new ethers.Contract(CONTRACT_ADDRESS, batchABI.abi, signer);

// // ✅ Minimal Status Mapping
// const STATUS = {
//     Created: 0,       // Manufacturer just created
//     Dispatched: 1,    // Manufacturer sent to distributor
//     Received: 3,      // Distributor received
//     Sold: 4           // Consumer purchased / Chemist sold
//   };
  

// export const updateStatusHandler = async (req, res) => {
//   try {
//     const { batchId, status, note } = req.body;
//     if (!batchId || !status)
//       return res.status(400).json({ error: "Missing batchId or status" });

//     const batchHash = ethers.keccak256(ethers.toUtf8Bytes(batchId));

//     // Convert status to number if string
//     const numericStatus =
//       typeof status === "string" ? STATUS[status] ?? 7 : Number(status);

//     const tx = await contract.updateStatus(batchHash, numericStatus, note || "");
//     await tx.wait();

//     res.status(200).json({
//       success: true,
//       message: `✅ Batch status updated to ${status}`,
//       txHash: tx.hash,
//     });
//   } catch (err) {
//     console.error("❌ Error updating status:", err);
//     res.status(500).json({ error: err.message });
//   }
// };
// backend/controllers/distributorController.js
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ---------------------------
// Setup paths and environment
// ---------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const abiPath = path.resolve(
  __dirname,
  "../../blockchain/artifacts/contracts/BatchRegistry.sol/BatchRegistry.json"
);

// Validate ABI existence
if (!fs.existsSync(abiPath)) {
  throw new Error(`❌ ABI file not found at path: ${abiPath}`);
}

const batchABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

// ---------------------------
// Environment configuration
// ---------------------------
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const DISTRIBUTOR_KEY = process.env.DISTRIBUTOR_KEY;

if (!CONTRACT_ADDRESS || !DISTRIBUTOR_KEY) {
  throw new Error("❌ Missing environment variables: CONTRACT_ADDRESS or DISTRIBUTOR_KEY");
}

// ---------------------------
// Ethers.js setup
// ---------------------------
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(DISTRIBUTOR_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, batchABI.abi, signer);

// ---------------------------
// Status Mapping
// ---------------------------
const STATUS = {
  Created: 0,      // Manufacturer created batch
  Dispatched: 1,   // Manufacturer sent to distributor
  InTransit: 2,    // On the way (optional stage)
  Received: 3,     // Distributor received
  Sold: 4          // Consumer purchased / Chemist sold
};

// ---------------------------
// Update Status Controller
// ---------------------------
export const updateStatusHandler = async (req, res) => {
  try {
    const { batchId, status, note } = req.body;

    if (!batchId || !status) {
      return res.status(400).json({ error: "Missing 'batchId' or 'status' field." });
    }

    // Check if provided status is valid
    const numericStatus =
      typeof status === "string"
        ? STATUS[status] ?? null
        : Number(status);

    if (numericStatus === null || Number.isNaN(numericStatus)) {
      return res.status(400).json({ error: `Invalid status value: ${status}` });
    }

    // Convert batch ID to keccak256 hash
    const batchHash = ethers.keccak256(ethers.toUtf8Bytes(batchId));

    console.log(`🛰️ Sending transaction to update status of batch: ${batchId}`);
    console.log(`   → New Status: ${status} (${numericStatus})`);
    console.log(`   → Note: ${note || "N/A"}`);

    const tx = await contract.updateStatus(batchHash, numericStatus, note || "");
    await tx.wait();

    console.log(`✅ Transaction confirmed! Hash: ${tx.hash}`);

    return res.status(200).json({
      success: true,
      message: `Batch ${batchId} status updated to ${status}`,
      txHash: tx.hash,
    });

  } catch (err) {
    console.error("❌ Error in updateStatusHandler:", err);
    return res.status(500).json({
      error: "Failed to update batch status.",
      details: err.reason || err.message || "Unknown error",
    });
  }
};
