import SimpleNN from '../utils/simpleNN.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to normalize temperature (0-50 range scaled to 0-1)
const normalize = (val) => val / 50;

// Generate Normal Data (Consistent low temperatures with minor fluctuations)
function generateNormalData(count = 3000) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const seq = [];
        let base = 18 + Math.random() * 5; // 18-23 range
        for (let j = 0; j < 5; j++) {
            seq.push(normalize(base + (Math.random() - 0.5) * 2));
        }
        data.push({ input: seq, output: [0] }); // 0 for normal
    }
    return data;
}

// Generate Anomaly Data (Sudden spikes or high temperatures)
function generateAnomalyData(count = 1000) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const seq = [];
        // Start normal
        let base = 18 + Math.random() * 5;
        for (let j = 0; j < 3; j++) {
            seq.push(normalize(base + (Math.random() - 0.5) * 2));
        }
        // Then spike
        seq.push(normalize(30 + Math.random() * 15)); // 30-45 spike
        seq.push(normalize(35 + Math.random() * 10)); // stay high
        data.push({ input: seq, output: [1] }); // 1 for anomaly
    }
    return data;
}

const trainingData = [
    ...generateNormalData(),
    ...generateAnomalyData()
];

// Shuffle data
trainingData.sort(() => Math.random() - 0.5);

console.log(`📊 Generated ${trainingData.length} samples for training...`);

// --- EXPORT THE DATASET FOR THE PROFESSOR ---
let csv = 'Temp1 (°C),Temp2 (°C),Temp3 (°C),Temp4 (°C),Temp5 (°C),Label (0=Normal 1=Anomaly),Classification\n';
trainingData.forEach(row => {
    // Un-normalize to get actual readable temperatures for the CSV
    const rawTemps = row.input.map(val => (val * 50).toFixed(2));
    const label = row.output[0];
    const type = label === 1 ? 'Anomaly' : 'Normal';
    csv += `${rawTemps.join(',')},${label},${type}\n`;
});

const datasetPath = path.resolve(__dirname, '../data/training_dataset.csv');
if (!fs.existsSync(path.dirname(datasetPath))) {
    fs.mkdirSync(path.dirname(datasetPath), { recursive: true });
}
fs.writeFileSync(datasetPath, csv);
console.log(`💾 Training dataset saved to: ${datasetPath}`);
// ---------------------------------------------


const net = new SimpleNN({
    inputNodes: 5,
    hiddenNodes: 10,
    outputNodes: 1,
    learningRate: 0.1
});

console.log('🧠 Training AI Model...');
const iterations = 100000;
for (let i = 0; i < iterations; i++) {
    const datum = trainingData[i % trainingData.length];
    net.train(datum.input, datum.output);

    if (i % 20000 === 0) {
        console.log(`Step ${i}/${iterations}...`);
    }
}

console.log('✅ Training complete!');

// Test with one normal and one anomaly
const testNormal = [normalize(20), normalize(21), normalize(22), normalize(21), normalize(20)];
const testAnomaly = [normalize(20), normalize(21), normalize(40), normalize(45), normalize(42)];

console.log('🧪 Testing Model:');
console.log('Normal Seq:', net.predict(testNormal)[0] > 0.5 ? 'Anomaly' : 'Normal', `(${net.predict(testNormal)[0].toFixed(4)})`);
console.log('Anomaly Seq:', net.predict(testAnomaly)[0] > 0.5 ? 'Anomaly' : 'Normal', `(${net.predict(testAnomaly)[0].toFixed(4)})`);

// Save the model
const modelPath = path.resolve(__dirname, '../data/aiModel.json');
const dataDir = path.dirname(modelPath);

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(modelPath, JSON.stringify(net.toJSON(), null, 2));
console.log(`💾 Model saved to: ${modelPath}`);
