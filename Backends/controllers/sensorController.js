import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkAnomaly } from '../utils/aiModule.js';
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const dataPath = path.resolve(__dirname, '../data/sensorData.json');
const recalledPath = path.resolve(__dirname, '../data/recalledBatches.json');
const abiPath = path.resolve(__dirname, "../config/BatchRegistry.json");

// Blockchain Config
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const MANUFACTURER_KEY = process.env.MANUFACTURER_KEY;

const getContractInstance = () => {
    const batchABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(MANUFACTURER_KEY, provider);
    return new ethers.Contract(CONTRACT_ADDRESS, batchABI.abi, signer);
};

// ── Persistent recalled batches (survives server restarts) ──────────────────
const loadRecalled = () => {
    if (fs.existsSync(recalledPath)) {
        return new Set(JSON.parse(fs.readFileSync(recalledPath, 'utf-8')));
    }
    return new Set();
};

const saveRecalled = (set) => {
    fs.writeFileSync(recalledPath, JSON.stringify([...set], null, 2));
};

// ── Sensor data helpers ──────────────────────────────────────────────────────
const loadSensorData = () => {
    if (fs.existsSync(dataPath)) {
        return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }
    return {};
};

const saveSensorData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// ── Initialize global state from disk on startup ─────────────────────────────
if (!global.recalledBatches) global.recalledBatches = loadRecalled();
if (!global.anomalyStreak)   global.anomalyStreak   = {};

// ── Receive sensor data ───────────────────────────────────────────────────────
export const receiveSensorData = async (req, res) => {
    try {
        const { batchId, temperature } = req.body;
        if (!batchId || temperature === undefined) {
            return res.status(400).json({ error: 'Missing batchId or temperature' });
        }

        // ✅ Always save the reading — even if already recalled, so the chart
        //    keeps updating for presentation / monitoring purposes.
        const allData = loadSensorData();
        if (!allData[batchId]) allData[batchId] = [];

        const timestamp = new Date().toISOString();
        allData[batchId].push({ temperature: parseFloat(temperature), timestamp });

        // Keep a rolling window of 100 readings
        if (allData[batchId].length > 100) allData[batchId].shift();
        saveSensorData(allData);

        // If already confirmed recalled, no need to re-run AI or blockchain
        const alreadyRecalled = global.recalledBatches.has(batchId);
        if (alreadyRecalled) {
            return res.status(200).json({
                success: true,
                anomalyDetected: true,
                recalled: true,
                message: '🚩 Batch is recalled — temperature data still recorded.'
            });
        }

        // ── AI Anomaly Detection ─────────────────────────────────────────────
        const sequence = allData[batchId].map(r => r.temperature);
        let anomalyDetected = false;

        if (sequence.length >= 5) {
            anomalyDetected = checkAnomaly(sequence);
        }

        // Require 3 CONSECUTIVE anomaly readings before recalling
        const RECALL_THRESHOLD = 3;
        if (anomalyDetected) {
            global.anomalyStreak[batchId] = (global.anomalyStreak[batchId] || 0) + 1;
            console.log(`⚠️  Anomaly streak for ${batchId}: ${global.anomalyStreak[batchId]}/${RECALL_THRESHOLD}`);
        } else {
            global.anomalyStreak[batchId] = 0; // Reset on a safe reading
        }

        const shouldRecall = global.anomalyStreak[batchId] >= RECALL_THRESHOLD;

        if (shouldRecall) {
            global.recalledBatches.add(batchId);
            saveRecalled(global.recalledBatches); // ✅ Persist to disk immediately
            console.log(`🏠 Triggering blockchain recall for batch: ${batchId}`);
            try {
                const contract = getContractInstance();
                const batchHash = ethers.keccak256(ethers.toUtf8Bytes(batchId));
                const tx = await contract.updateStatus(batchHash, 6, "AI Alert: Unsafe temperature pattern detected.");
                await tx.wait();
                console.log(`🔗 Blockchain status updated! Tx: ${tx.hash}`);
            } catch (bcErr) {
                console.error('❌ Blockchain update failed:', bcErr.message);
                global.recalledBatches.delete(batchId);
                saveRecalled(global.recalledBatches);
            }
        }

        res.status(200).json({
            success: true,
            anomalyDetected: shouldRecall,
            message: shouldRecall
                ? '🚨 BATCH RECALLED due to sustained unsafe temperatures!'
                : '✅ Data received.'
        });

    } catch (err) {
        console.error('❌ Error in receiveSensorData:', err);
        res.status(500).json({ error: err.message });
    }
};

// ── Get sensor history (used by frontend polling) ─────────────────────────────
export const getSensorHistory = async (req, res) => {
    try {
        const { batchId } = req.params;
        const allData = loadSensorData();
        const history = allData[batchId] || [];

        // Fast path: check in-memory cache first
        let isRecalled = global.recalledBatches.has(batchId);

        // Slow path: if not in cache, query blockchain directly — this is the
        // authoritative source and handles batches recalled in previous sessions.
        if (!isRecalled) {
            try {
                const contract = getContractInstance();
                const batchHash = ethers.keccak256(ethers.toUtf8Bytes(batchId));
                const batch = await contract.getBatchDetails(batchHash);
                if (batch && Number(batch[4]) === 6) {
                    isRecalled = true;
                    // Warm the cache so future polls are fast
                    global.recalledBatches.add(batchId);
                    saveRecalled(global.recalledBatches);
                    console.log(`📋 Loaded recalled status for ${batchId} from blockchain.`);
                }
            } catch (e) {
                // Blockchain unreachable — fall back to cache result (false)
                console.warn(`⚠️  Could not check blockchain for ${batchId}:`, e.message);
            }
        }

        res.status(200).json({ success: true, history, isRecalled });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
