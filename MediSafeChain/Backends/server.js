// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import manufacturerRoutes from "./routes/manufacturerRoutes.js";
import distributorRoutes from "./routes/distributorRoutes.js";
import consumerRoutes from "./routes/consumerRoutes.js";
import blockchainRoutes from "./routes/blockchainRoutes.js";

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

// Global error handler (last middleware)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
