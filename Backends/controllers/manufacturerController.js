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

const abiPath = path.resolve(__dirname, "../config/BatchRegistry.json");
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

    // 🚀 Start Internal Virtual Sensor Simulation
    let simStep = 0;
    let isFailing = false;
    const interval = setInterval(async () => {
        try {
            let temp;
            // 10% chance to fail after 5 readings
            if (simStep > 5 && Math.random() < 0.1) isFailing = true;
            
            temp = isFailing ? (38 + Math.random() * 7) : (20 + Math.random() * 5);
            
            const res = await fetch(`http://localhost:${process.env.PORT || 5000}/api/sensor/data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ batchId, temperature: temp })
            });
            const data = await res.json();
            
            simStep++;
            // Stop simulating immediately if recalled to halt temperature creation requests
            if (data.anomalyDetected) {
                console.log(`🛑 BATCH RECALLED! Halting sensor simulation for ${batchId}.`);
                clearInterval(interval);
            }
        } catch(e) {
            console.error("Internal Sim Error:", e.message);
        }
    }, 5000);

    res.status(200).json({
      success: true,
      message: "✅ Batch created and virtual sensor securely attached!",
      txHash: tx.hash,
      qrPayload,
      qrImage,
    });
  } catch (err) {
    console.error("❌ Error creating batch:", err);
    res.status(500).json({ error: err.message });
  }
};
