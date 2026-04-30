import express from 'express';
import { getDLMetrics } from '../controllers/dlController.js';

const router = express.Router();

router.get('/metrics', getDLMetrics);

export default router;
