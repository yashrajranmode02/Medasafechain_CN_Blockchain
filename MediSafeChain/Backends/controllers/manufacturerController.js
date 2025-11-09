// backend/controllers/manufacturerController.js
import { ethers } from "ethers";
import dotenv from "dotenv";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Proper __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Correct ABI path
const abiPath = path.resolve(
  __dirname,
  "../../blockchain/artifacts/contracts/BatchRegistry.sol/BatchRegistry.json"
);
const batchABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const MANUFACTURER_KEY = process.env.MANUFACTURER_KEY;

const getContractInstance = () => {
  if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS not set in .env");
  if (!MANUFACTURER_KEY) throw new Error("MANUFACTURER_KEY not set in .env");

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(MANUFACTURER_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, batchABI.abi, signer);
  return { contract, signer };
};

export const createBatchHandler = async (req, res) => {
  try {
    const { batchId, medicineName, qrPayload } = req.body;
    if (!batchId || !medicineName || !qrPayload)
      return res.status(400).json({ error: "Missing required fields" });

    const { contract, signer } = getContractInstance();

    const batchHash = ethers.keccak256(ethers.toUtf8Bytes(batchId));
    const qrHash = ethers.keccak256(ethers.toUtf8Bytes(qrPayload));

    const tx = await contract.createBatch(
      batchHash,
      medicineName,
      qrHash,
      signer.address
    );
    await tx.wait();

    const qrImage = await QRCode.toDataURL(qrPayload);

    res.status(200).json({
      success: true,
      message: "✅ Batch created successfully",
      txHash: tx.hash,
      qrPayload,
      qrImage,
    });
  } catch (err) {
    console.error("❌ Error creating batch:", err);
    res.status(500).json({ error: err.message });
  }
};
