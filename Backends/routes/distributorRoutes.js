
import express from "express";
import { updateStatusHandler } from "../controllers/distributorController.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// POST /api/distributor/update
router.post("/update", requireRole("distributor"), updateStatusHandler);

export default router;
