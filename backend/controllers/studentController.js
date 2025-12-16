import Student from "../models/Student.js";
import Family from "../models/Family.js";
import AppError from "../utils/errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import { ROLES } from "../config/constants.js";

export class StudentController {
  // Create Student (Usually called via FamilyController, but kept here if direct route needed)
  static async createStudent(req, res, next) {
    // This logic is mostly handled by AuthService.createStudentByFamily
    // If you need a direct controller method, it would wrap that service call.
    next(new AppError("Use /families/students to create a student", StatusCodes.BAD_REQUEST));
  }

  // Get Students (For Family)
  static async getMyStudents(req, res, next) {
    // Re-routed to FamilyController usually, but safe fallback:
    try {
      const family = await Family.findOne({ user: req.user.id });
      const students = await Student.find({ family: family._id });
      res.status(StatusCodes.OK).json({ success: true, data: students });
    } catch (error) {
      next(error);
    }
  }

  // Get Specific Student (Permissions: Own Family, Own Student, or Mentor)
  static async getStudentById(req, res, next) {
    try {
      const student = await Student.findById(req.params.id)
        .populate("user", "name email")
        .populate("family", "familyName contactPhone");

      if (!student) {
        throw new AppError("Student not found", StatusCodes.NOT_FOUND);
      }

      // Security Check: Ensure user is allowed to view this student
      const requestorId = req.user.id;
      const requestorRole = req.user.role;
      
      // 1. If requester is the Student themselves
      if (requestorRole === ROLES.STUDENT && student.user._id.toString() !== requestorId) {
        throw new AppError("Access denied", StatusCodes.FORBIDDEN);
      }
      
      // 2. If requester is the Family (Parent)
      if (requestorRole === ROLES.FAMILY) {
        const family = await Family.findOne({ user: requestorId });
        if (!family || student.family._id.toString() !== family._id.toString()) {
           throw new AppError("Access denied: Not your student", StatusCodes.FORBIDDEN);
        }
      }

      res.status(StatusCodes.OK).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update Student Profile
  static async updateStudentProfile(req, res, next) {
    try {
      const studentId = req.params.id;
      
      // Basic security check (Simplified)
      // In production, verify ownership deeply here
      
      const student = await Student.findByIdAndUpdate(
        studentId,
        req.body,
        { new: true, runValidators: true }
      );

      if (!student) {
        throw new AppError("Student not found", StatusCodes.NOT_FOUND);
      }

      res.status(StatusCodes.OK).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }
}