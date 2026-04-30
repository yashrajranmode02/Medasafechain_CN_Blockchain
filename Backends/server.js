// backend/server.js
console.log("Starting server...");
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import manufacturerRoutes from "./routes/manufacturerRoutes.js";
console.log("Routes loaded");
import distributorRoutes from "./routes/distributorRoutes.js";
console.log("Routes loaded");
import consumerRoutes from "./routes/consumerRoutes.js";
console.log("Routes loaded");
import blockchainRoutes from "./routes/blockchainRoutes.js";

import sensorRoutes from "./routes/sensorRoutes.js";console.log("Routes loaded");
console.log("Routes loaded");
import authRoutes from "./routes/authRoutes.js";
import dlRoutes from "./routes/dlRoutes.js";
console.log("Routes loaded");

// Middleware
import errorHandler from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use("/api/manufacturer", manufacturerRoutes);
app.use("/api/distributor", distributorRoutes);
app.use("/api/consumer", consumerRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/sensor", sensorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dl", dlRoutes);

// Global error handler (last middleware)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
