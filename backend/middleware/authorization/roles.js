import AppError from "../../utils/errors/AppError.js";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware to restrict access to specific roles.
 * Example: restrictTo('admin', 'mentor')
 */
export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by the 'authenticate' middleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          StatusCodes.FORBIDDEN
        )
      );
    }
    next();
  };
};