import express from 'express';
import { receiveSensorData, getSensorHistory } from '../controllers/sensorController.js';

const router = express.Router();

router.post('/data', receiveSensorData);
router.get('/history/:batchId', getSensorHistory);

export default router;
