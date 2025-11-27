import cors from "cors";
import { CLIENT_URL, NODE_ENV } from "../../config/environment.js";

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin && NODE_ENV === "development") return callback(null, true);

    const allowedOrigins = [
      CLIENT_URL,
      "http://localhost:3000",
      "https://localhost:3000",
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

export default cors(corsOptions);
