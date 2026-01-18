// backend/controllers/consumerController.js
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Proper __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Correct ABI path
const abiPath = path.resolve(
  __dirname,
  "../../blockchain/artifacts/contracts/BatchRegistry.sol/BatchRegistry.json"
);
const batchABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

// Environment
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const CONSUMER_KEY = process.env.CONSUMER_KEY;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(CONSUMER_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, batchABI.abi, signer);

// ✅ Helper: convert numeric status → readable text
const STATUS_MAP = {
  0: "Created by Manufacturer",
  1: "In Transit to Distributor",
  2: "Received by Distributor",
  3: "Delivered to Pharmacy",
  4: "Verified by Consumer",
};

// ✅ Verify Batch (with batchId + qrPayload)
export const verifyBatchHandler = async (req, res) => {
  try {
    const { batchId, qrPayload } = req.body;

    // Validate inputs
    if (!batchId || !qrPayload) {
      return res
        .status(400)
        .json({ error: "Missing batchId or qrPayload" });
    }

    // Generate hashes
    const batchHash = ethers.keccak256(ethers.toUtf8Bytes(batchId));
    const qrHash = ethers.keccak256(ethers.toUtf8Bytes(qrPayload));

    // Fetch batch details
    const batch = await contract.getBatchDetails(batchHash);
    if (!batch || !batch[0]) {
      return res.status(404).json({ error: "❌ Batch not found" });
    }

    // Match QR code
    const storedQrHash = batch[5];
    if (storedQrHash !== qrHash) {
      return res
        .status(401)
        .json({ error: "❌ QR code does not match this batch" });
    }

    const statusNum = Number(batch[4]);
    const statusText = STATUS_MAP[statusNum] || `Unknown (${statusNum})`;

    res.status(200).json({
      success: true,
      message: "✅ Batch verified successfully",
      batchId,
      currentStatus: statusText,
      manufacturer: batch[2],
    });
  } catch (err) {
    console.error("❌ Error verifying batch:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Batch Details
export const getBatchDetailsHandler = async (req, res) => {
  try {
    const { batchId } = req.params;
    if (!batchId)
      return res.status(400).json({ error: "Batch ID required" });

    const batchHash = ethers.keccak256(ethers.toUtf8Bytes(batchId));
    const [
      id,
      medicineName,
      manufacturer,
      createdAt,
      currentStatus,
      qrHash,
    ] = await contract.getBatchDetails(batchHash);

    const statusText = STATUS_MAP[Number(currentStatus)] || "Unknown";

    res.status(200).json({
      success: true,
      message: "📦 Batch details fetched successfully",
      batch: {
        id,
        medicineName,
        manufacturer,
        createdAt: new Date(Number(createdAt) * 1000).toLocaleString(),
        currentStatus: statusText,
        qrHash,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching batch details:", err);
    res.status(500).json({ error: err.message });
  }
};
