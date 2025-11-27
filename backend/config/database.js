import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "./environment.js";
import logger from "../utils/logger.js";

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

class Database {
  constructor() {
    this.isConnected = false;
    this.retryCount = 0;
  }

  async connect() {
    try {
      mongoose.set("debug", NODE_ENV === "development");

      await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      this.retryCount = 0;

      logger.info("✅ MongoDB connected successfully");

      mongoose.connection.on("error", (error) => {
        logger.error("MongoDB connection error:", error);
        this.isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected");
        this.isConnected = false;
        this.handleDisconnection();
      });
    } catch (error) {
      logger.error("Failed to connect to MongoDB:", error);
      this.handleDisconnection();
    }
  }

  async handleDisconnection() {
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount++;
      logger.info(`Retrying connection... Attempt ${this.retryCount}`);

      setTimeout(() => this.connect(), RETRY_DELAY);
    } else {
      logger.error(
        "Max retry attempts reached. Please check MongoDB configuration."
      );
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info("MongoDB disconnected gracefully");
    } catch (error) {
      logger.error("Error disconnecting from MongoDB:", error);
    }
  }
}

export default new Database();
