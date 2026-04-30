import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We will generate the RAW (un-normalized) temperatures for the CSV 
// so that it is readable and makes sense to your professor.

function generateNormalData(count = 1000) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const seq = [];
        let base = 18 + Math.random() * 5; // 18-23 range
        for (let j = 0; j < 5; j++) {
            seq.push(base + (Math.random() - 0.5) * 2);
        }
        data.push({ input: seq, label: 0, type: 'Normal' });
    }
    return data;
}

function generateAnomalyData(count = 500) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const seq = [];
        // Start normal
        let base = 18 + Math.random() * 5;
        for (let j = 0; j < 3; j++) {
            seq.push(base + (Math.random() - 0.5) * 2);
        }
        // Then spike
        seq.push(30 + Math.random() * 15); // 30-45 spike
        seq.push(35 + Math.random() * 10); // stay high
        data.push({ input: seq, label: 1, type: 'Anomaly' });
    }
    return data;
}

const dataset = [
    ...generateNormalData(),
    ...generateAnomalyData()
];

// Shuffle data
dataset.sort(() => Math.random() - 0.5);

// Convert to CSV
let csv = 'Temp1 (°C),Temp2 (°C),Temp3 (°C),Temp4 (°C),Temp5 (°C),Label (0=Normal 1=Anomaly),Classification\n';
dataset.forEach(row => {
    // Format temperatures to 2 decimal places
    const temps = row.input.map(t => t.toFixed(2)).join(',');
    csv += `${temps},${row.label},${row.type}\n`;
});

// Save to the data folder
const outputPath = path.resolve(__dirname, '../data/temperature_dataset.csv');
const dataDir = path.dirname(outputPath);

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(outputPath, csv);
console.log(`✅ Dataset successfully exported as CSV to: ${outputPath}`);
