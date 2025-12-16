import Student from '../../models/Student.js';
import Family from '../../models/Family.js';
import AppError from '../../utils/errors/AppError.js';
import { StatusCodes } from 'http-status-codes';

export class FamilyStudentService {
  /**
   * Add student to family
   */
  static async addStudent(familyUserId, studentData) {
    // 1️⃣ Find family by user ID
    const family = await Family.findOne({ user: familyUserId });
    if (!family) {
      throw new AppError(
        'Family profile not found. Please create a family profile first.',
        StatusCodes.NOT_FOUND
      );
    }

    // 2️⃣ Create student with correct family reference
    const student = await Student.create({
      family: family._id, // Link student to family ID
      ...studentData
    });

    // 3️⃣ Optional: add to family's students array (if using array)
    if (Array.isArray(family.students)) {
      family.students.push(student._id);
      await family.save();
    }

    // 4️⃣ Populate family info to return
    return await student.populate('family', 'familyName contactPhone');
  }

  /**
   * Get all students for a family
   */
  static async getStudentsByFamilyUserId(familyUserId) {
    const family = await Family.findOne({ user: familyUserId });
    if (!family) {
      throw new AppError('Family profile not found', StatusCodes.NOT_FOUND);
    }

    return await Student.find({ family: family._id, isActive: true })
      .select(
        'name dateOfBirth gradeLevel school subjects learningGoals specialNeeds profileCompletion'
      )
      .sort({ createdAt: -1 });
  }

  /**
   * Get single student with ownership verification
   */
  static async getStudentById(studentId, familyUserId) {
    const family = await Family.findOne({ user: familyUserId });
    if (!family) {
      throw new AppError('Family profile not found', StatusCodes.NOT_FOUND);
    }

    const student = await Student.findOne({ _id: studentId, family: family._id })
      .populate('family', 'familyName contactPhone');

    if (!student) {
      throw new AppError('Student not found or access denied', StatusCodes.NOT_FOUND);
    }

    return student;
  }

  /**
   * Update student
   */
  static async updateStudent(studentId, familyUserId, updateData) {
    const family = await Family.findOne({ user: familyUserId });
    if (!family) {
      throw new AppError('Family profile not found', StatusCodes.NOT_FOUND);
    }

    const student = await Student.findOneAndUpdate(
      { _id: studentId, family: family._id }, // ensure ownership
      { $set: updateData, $currentDate: { lastActive: true } },
      { new: true, runValidators: true }
    ).populate('family', 'familyName contactPhone');

    if (!student) {
      throw new AppError('Student not found or access denied', StatusCodes.NOT_FOUND);
    }

    return student;
  }

  /**
   * Soft delete student
   */
  static async deleteStudent(studentId, familyUserId) {
    const family = await Family.findOne({ user: familyUserId });
    if (!family) {
      throw new AppError('Family profile not found', StatusCodes.NOT_FOUND);
    }

    const student = await Student.findOneAndUpdate(
      { _id: studentId, family: family._id },
      { $set: { isActive: false }, $currentDate: { lastActive: true } },
      { new: true }
    );

    if (!student) {
      throw new AppError('Student not found or access denied', StatusCodes.NOT_FOUND);
    }

    // Optional: remove from family's students array if using array
    if (Array.isArray(family.students)) {
      family.students.pull(studentId);
      await family.save();
    }

    return student;
  }
}
