import dotenv from "dotenv";
import { cleanEnv, str, port, num, url } from "envalid";

// Load .env file
dotenv.config();

// Validate and clean environment variables
const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "development",
  }),
  PORT: port({ default: 5000 }),
  
  // Changed to MONGO_URI to match standard database.js conventions
  // Changed localhost to 127.0.0.1 to avoid Node 17+ IPv6 issues
  MONGODB_URI: url({
    devDefault: "mongodb://127.0.0.1:27017/mentorship_platform",
    desc: "MongoDB Connection String",
  }),

  // JWT Configuration
  JWT_SECRET: str({
    devDefault: "fallback-secret-change-in-production",
    desc: "Secret key for signing Access Tokens",
  }),
  JWT_REFRESH_SECRET: str({
    devDefault: "fallback-refresh-secret-change-in-production",
    desc: "Secret key for signing Refresh Tokens",
  }),
  JWT_EXPIRES_IN: str({ 
    default: "15m",
    desc: "Access token lifespan (e.g. 15m, 1h)" 
  }),
  JWT_REFRESH_EXPIRES_IN: str({ 
    default: "30d",
    desc: "Refresh token lifespan (e.g. 7d, 30d)"
  }),
  JWT_COOKIE_EXPIRES_IN: num({ 
    default: 7,
    desc: "Cookie expiration in days" 
  }),

  // Security & Client
  BCRYPT_ROUNDS: num({ default: 12 }),
  CLIENT_URL: url({ 
    default: "http://localhost:3000",
    desc: "Frontend URL for CORS configuration"
  }),
});

// Export authenticated variables
export const {
  NODE_ENV,
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN,
  BCRYPT_ROUNDS,
  CLIENT_URL,
} = env;