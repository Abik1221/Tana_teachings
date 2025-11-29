import { AuthService } from '../services/auth/authService.js';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const userData = req.validatedData;
      const result = await AuthService.register(userData);

      logger.info(`New ${userData.role} registered: ${userData.email}`);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: `${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} registered successfully`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.validatedData;
      const result = await AuthService.login(email, password);

      logger.info(`User logged in: ${email}`);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await AuthService.getUserWithProfile(req.user.id);

      res.status(StatusCodes.OK).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const updateData = req.validatedData;

      const updatedUser = await AuthService.updateProfile(userId, updateData);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const profileData = req.validatedData;
      const userRole = req.user.role;

      const result = await AuthService.createRoleProfile(userId, userRole, profileData);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: `${userRole} profile created successfully`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }
}