import Family from '../../models/Family.js';
import User from '../../models/User.js';
import AppError from '../../utils/errors/AppError.js';
import { StatusCodes } from 'http-status-codes';

export class FamilyProfileService {
  /**
   * Get family profile by user ID
   */
  static async getFamilyProfile(userId) {
    const family = await Family.findOne({ user: userId })
      .populate('user', 'name email avatar phone status lastLogin')
      .populate('students', 'name gradeLevel subjects isActive profileCompletion');

    if (!family) {
      throw new AppError('Family profile not found', StatusCodes.NOT_FOUND);
    }

    return family;
  }

  /**
   * Create or update family profile
   */
  static async createOrUpdateProfile(userId, profileData) {
    const user = await User.findById(userId);
    if (!user || user.role !== 'family') {
      throw new AppError('User not found or not a family', StatusCodes.BAD_REQUEST);
    }

    let family = await Family.findOne({ user: userId });

    if (family) {
      family = await Family.findOneAndUpdate(
        { user: userId },
        { $set: profileData, $currentDate: { lastActive: true } },
        { new: true, runValidators: true, context: 'query' }
      ).populate('user', 'name email avatar');
    } else {
      family = new Family({ user: userId, ...profileData });
      await family.save();
      family = await family.populate('user', 'name email avatar');
    }

    return family;
  }

  /**
   * Update contact info
   */
  static async updateContactInfo(userId, contactData) {
    const family = await Family.findOneAndUpdate(
      { user: userId },
      { $set: contactData, $currentDate: { lastActive: true } },
      { new: true, runValidators: true }
    ).populate('user', 'name email avatar');

    if (!family) throw new AppError('Family profile not found', StatusCodes.NOT_FOUND);
    return family;
  }

  /**
   * Update address
   */
  static async updateAddress(userId, addressData) {
    const family = await Family.findOneAndUpdate(
      { user: userId },
      { $set: { address: addressData }, $currentDate: { lastActive: true } },
      { new: true, runValidators: true }
    ).populate('user', 'name email avatar');

    if (!family) throw new AppError('Family profile not found', StatusCodes.NOT_FOUND);
    return family;
  }

  /**
   * Update emergency contact
   */
  static async updateEmergencyContact(userId, emergencyContactData) {
    const family = await Family.findOneAndUpdate(
      { user: userId },
      { $set: { emergencyContact: emergencyContactData }, $currentDate: { lastActive: true } },
      { new: true, runValidators: true }
    ).populate('user', 'name email avatar');

    if (!family) throw new AppError('Family profile not found', StatusCodes.NOT_FOUND);
    return family;
  }
}