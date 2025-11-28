import Student from "../../models/Student.js";
import Family from "../../models/Family.js";
import AppError from "../../utils/errors/AppError.js";
import { StatusCodes } from "http-status-codes";

export class StudentService {
  static async createStudent(studentData, parentId) {
    // Verify family exists
    const family = await Family.findOne({ parent: parentId });
    if (!family)
      throw new AppError("Family profile required", StatusCodes.BAD_REQUEST);

    const student = await Student.create({
      ...studentData,
      family: family._id,
    });

    return await student.populate("family");
  }

  static async getStudentsByParent(parentId) {
    const family = await Family.findOne({ parent: parentId });
    if (!family) throw new AppError("Family not found", StatusCodes.NOT_FOUND);

    return await Student.find({ family: family._id }).populate("family");
  }
}
