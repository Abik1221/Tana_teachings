import Mentor from "../models/Mentor.js";
import User from "../models/User.js";
import AppError from "../utils/errors/AppError.js";
import { StatusCodes } from "http-status-codes";

export class MentorController {
  // Public: List all mentors (with pagination/filtering)
  static async getAllMentors(req, res, next) {
    try {
      const { subject, level } = req.query;
      const query = { isActive: true, isVerified: true };

      if (subject) {
        query["subjects.subject"] = { $regex: subject, $options: "i" };
      }

      const mentors = await Mentor.find(query)
        .populate("user", "name avatar") // Only show safe user fields
        .select("-__v");

      res.status(StatusCodes.OK).json({
        success: true,
        count: mentors.length,
        data: mentors,
      });
    } catch (error) {
      next(error);
    }
  }

  // Public: Get specific mentor details
  static async getMentorById(req, res, next) {
    try {
      const mentor = await Mentor.findById(req.params.id)
        .populate("user", "name email phone avatar")
        .populate("rating.reviews.student", "name");

      if (!mentor) {
        throw new AppError("Mentor not found", StatusCodes.NOT_FOUND);
      }

      res.status(StatusCodes.OK).json({
        success: true,
        data: mentor,
      });
    } catch (error) {
      next(error);
    }
  }

  // Private: Update my profile
  static async updateMyProfile(req, res, next) {
    try {
      // req.user.id is the User ID. We need to find the Mentor doc linked to it.
      const mentor = await Mentor.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!mentor) {
        throw new AppError("Mentor profile not found", StatusCodes.NOT_FOUND);
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Profile updated successfully",
        data: mentor,
      });
    } catch (error) {
      next(error);
    }
  }

  // Private: Get Dashboard Stats
  static async getDashboardStats(req, res, next) {
    try {
      const mentor = await Mentor.findOne({ user: req.user.id });
      if (!mentor) throw new AppError("Profile not found", StatusCodes.NOT_FOUND);

      // Placeholder stats - will eventually query Sessions/Payments models
      const stats = {
        totalStudents: 0,
        totalHours: 0,
        pendingRequests: 0,
        rating: mentor.rating.average,
      };

      res.status(StatusCodes.OK).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // Private: Get Matching Jobs
  static async getMatchingJobs(req, res, next) {
    try {
      const mentor = await Mentor.findOne({ user: req.user.id });
      // In future: Query 'Job' model based on mentor.subjects
      res.status(StatusCodes.OK).json({
        success: true,
        data: [], // Return empty array until Job model is built
      });
    } catch (error) {
      next(error);
    }
  }
}