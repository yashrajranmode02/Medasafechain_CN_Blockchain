import axios from 'axios';

// Configuration
const BATCH_ID = process.argv[2] || 'BATCH_001';
const INTERVAL = 5000; // 5 seconds
const MODE = process.argv[3] || 'unsafe'; // 'safe' or 'unsafe'
const API_URL = 'http://localhost:5000/api/sensor/data';

console.log(`🚀 Starting Virtual Sensor Simulation`);
console.log(`📦 Batch ID: ${BATCH_ID} | 🛠️ Mode: ${MODE.toUpperCase()}`);
console.log(`📡 Reporting to: ${API_URL}`);

let step = 0;
let isHardwareFailing = false;

const sendData = async () => {
    try {
        let temp;

        if (MODE === 'safe') {
            // Always stay in 20-25 range
            temp = 21 + Math.random() * 3;
        } else if (MODE === 'auto') {
            // Randomly trigger a hardware failure (10% chance after step 5)
            if (step > 5 && Math.random() < 0.1) {
                isHardwareFailing = true;
                console.log('⚠️ [RANDOM EVENT] Cooling system failure simulated...');
            }

            if (isHardwareFailing) {
                temp = 38 + Math.random() * 7; // Spikes to unsafe temps
            } else {
                temp = 20 + Math.random() * 5; // Normal temps
            }
        } else {
            // Original simulation: normal first, then spike
            if (step < 5) {
                temp = 20 + Math.random() * 5;
            } else {
                if (step === 5) console.log('⚠️ Simulating anomaly spike...');
                temp = 38 + Math.random() * 7;
            }
        }

        console.log(`[${new Date().toLocaleTimeString()}] Senor Data: ${temp.toFixed(2)}°C`);

        const response = await axios.post(API_URL, {
            batchId: BATCH_ID,
            temperature: temp
        });

        if (response.data.anomalyDetected) {
            console.log('🚨 BACKEND SIGNALED ANOMALY! Protocol triggered.');
        }

        step++;
    } catch (error) {
        console.error('❌ Failed to send data:', error.message);
    }
};

// Start simulation
setInterval(sendData, INTERVAL);
sendData();
