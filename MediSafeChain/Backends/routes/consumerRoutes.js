import express from "express";
import { verifyBatchHandler, getBatchDetailsHandler } from "../controllers/consumerController.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// POST /api/consumer/verify
router.post("/verify", requireRole("consumer"), verifyBatchHandler);

// GET /api/consumer/details/:batchId
router.get("/details/:batchId", requireRole("consumer"), getBatchDetailsHandler);

export default router;
