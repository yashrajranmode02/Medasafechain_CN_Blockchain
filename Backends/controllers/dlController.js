import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const metricsPath = path.resolve(__dirname, '../../DL/deep_training_metrics.json');

export const getDLMetrics = (req, res) => {
    try {
        if (fs.existsSync(metricsPath)) {
            const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'));
            res.status(200).json({ success: true, metrics });
        } else {
            res.status(404).json({ success: false, message: 'Metrics not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
