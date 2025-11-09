// backend/routes/manufacturerRoutes.js
import express from "express";
import { createBatchHandler } from "../controllers/manufacturerController.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// POST /api/manufacturer/create
router.post("/create", requireRole("manufacturer"), createBatchHandler);

export default router;

