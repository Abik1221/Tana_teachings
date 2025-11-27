import express from "express";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import cors from "./middleware/security/cors.js";
import { generalLimiter } from "./middleware/security/rateLimiting.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/utility/errorHandler.js";
import logger from "./utils/logger.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors);
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization
// Data sanitization (only sanitize req.body)
// app.use(
//   mongoSanitize({
//     replaceWith: "_",      // optional: replaces forbidden chars with "_"
//     checkQuery: false,     // <--- DO NOT touch req.query
//     checkParams: false     // <--- DO NOT touch req.params
//   })
// );
// app.use(xss());

// Compression
app.use(compression());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();

  // When response is finished
  res.on('finish', () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
      ip: req.ip,
      service: 'mentorship-platform',
      timestamp: new Date().toISOString(),
      userAgent: req.get("User-Agent"),
      duration: `${Date.now() - start}ms`
    });
  });

  next();
});


// Routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

// Handle unhandled routes
app.all(/(.*)/, (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;
