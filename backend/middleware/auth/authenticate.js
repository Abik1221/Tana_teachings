import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/environment.js";
import User from "../../models/User.js";
import AppError from "../../utils/errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import { AUTH_ERRORS } from "../../config/constants.js";

export const authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Get the raw header
    const authHeader = req.headers.authorization;

    // DEBUGGING LOGS (Check your terminal when you hit the endpoint)
    console.log("==========================================");
    console.log(`[Auth Middleware] Request URL: ${req.originalUrl}`);
    console.log(`[Auth Middleware] Raw Header: '${authHeader}'`);

    // 1️⃣ Extract token
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      console.log("[Auth Middleware] ❌ No token found in header");
      return next(
        new AppError(AUTH_ERRORS.UNAUTHORIZED, StatusCodes.UNAUTHORIZED)
      );
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3️⃣ Fetch user
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("[Auth Middleware] ❌ Token valid, but User ID not found in DB");
      return next(
        new AppError(AUTH_ERRORS.USER_NOT_FOUND, StatusCodes.UNAUTHORIZED)
      );
    }

    if (typeof user.isActive === 'function' && !user.isActive()) {
      return next(
        new AppError(AUTH_ERRORS.ACCOUNT_SUSPENDED, StatusCodes.FORBIDDEN)
      );
    }

    // Success
    req.user = user;
    next();
  } catch (error) {
    console.log("[Auth Middleware] 💥 Error:", error.name);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(
        new AppError(AUTH_ERRORS.INVALID_TOKEN, StatusCodes.UNAUTHORIZED)
      );
    }
    next(error);
  }
};