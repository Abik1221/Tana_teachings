import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/environment.js";
import User from "../../models/User.js";
import AppError from "../../utils/errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import { AUTH_ERRORS } from "../../config/constants.js";

export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError(AUTH_ERRORS.UNAUTHORIZED, StatusCodes.UNAUTHORIZED)
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new AppError(AUTH_ERRORS.USER_NOT_FOUND, StatusCodes.UNAUTHORIZED)
      );
    }

    if (!user.isActive()) {
      return next(
        new AppError(AUTH_ERRORS.ACCOUNT_SUSPENDED, StatusCodes.FORBIDDEN)
      );
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
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
