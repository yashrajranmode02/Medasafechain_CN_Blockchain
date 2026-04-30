import SimpleNN from './simpleNN.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelPath = path.resolve(__dirname, '../data/aiModel.json');

let net = null;

const loadModel = () => {
    if (!net && fs.existsSync(modelPath)) {
        const modelData = JSON.parse(fs.readFileSync(modelPath, 'utf-8'));
        net = new SimpleNN();
        net.fromJSON(modelData);
        console.log('🧠 AI Model loaded successfully.');
    }
    return net;
};

// Normalize 0-50 to 0-1
const normalize = (val) => val / 50;

/**
 * Checks a sequence of temperatures for anomalies.
 * @param {Array} sequence - Array of temperature values (length should be at least 5)
 * @returns {Boolean} - True if anomaly detected
 */
export const checkAnomaly = (sequence) => {
    const model = loadModel();
    if (!model) {
        console.warn('⚠️ AI Model not found. skipping anomaly detection.');
        return false;
    }

    // Ensure we have a sequence of 5
    if (sequence.length < 5) return false;

    // Take the last 5 readings
    const last5 = sequence.slice(-5).map(normalize);
    const result = model.predict(last5);

    const isAnomaly = result[0] > 0.6; // Threshold for anomaly
    if (isAnomaly) {
        console.log(`🚨 ANOMALY DETECTED! Probability: ${(result[0] * 100).toFixed(2)}%`);
    }
    return isAnomaly;
};
