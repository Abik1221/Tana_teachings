import app from "./app.js";
import database from "./config/database.js";
import { PORT, NODE_ENV } from "./config/environment.js";
import logger from "./utils/logger.js";

const familyRoutes = require('./routes/family');

app.use('/api/families', familyRoutes);

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...", error);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    await database.connect();

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (error) => {
      logger.error("UNHANDLED REJECTION! 💥 Shutting down...", error);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
      server.close(() => {
        database.disconnect();
        logger.info("💥 Process terminated");
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
