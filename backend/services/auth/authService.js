import User from '../../models/User.js';
import Family from '../../models/Family.js';
import Student from '../../models/Student.js';
import Mentor from '../../models/Mentor.js';
import { TokenService } from './tokenService.js';
import { PasswordService } from './passwordService.js';
import AppError from '../../utils/errors/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { AUTH_ERRORS, ROLES } from '../../config/constants.js';


export class AuthService {
  static async register(userData) {
    const { name, email, password, role, phone } = userData;

    // 1. Basic Validation (COMMON DATA ONLY)
    if (!name || !email || !password || !role) {
      throw new AppError('Name, email, password, and role are required', StatusCodes.BAD_REQUEST);
    }

    if (!Object.values(ROLES).includes(role)) {
      throw new AppError(`Invalid role. Must be one of: ${Object.values(ROLES).join(', ')}`, StatusCodes.BAD_REQUEST);
    }

    // 2. Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError(AUTH_ERRORS.EMAIL_EXISTS, StatusCodes.CONFLICT);
    }

    // 3. Validate Password
    const passwordError = PasswordService.validatePasswordStrength(password);
    if (passwordError) {
      throw new AppError(passwordError, StatusCodes.BAD_REQUEST);
    }

    // 4. Create User (COMMON DATA ONLY - No profile data during registration)
    let user;
    try {
      user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role,
        phone: phone?.trim() || undefined,
      });
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError('User with this email already exists', StatusCodes.CONFLICT);
      }
      throw err;
    }

    // 5. Create EMPTY Role-Specific Document (Only user reference)
    let roleSpecificDoc;

    try {
      if (role === ROLES.FAMILY) {
        roleSpecificDoc = await Family.create({
          user: user._id,
          // Empty fields - will be filled later
          familyName: '',
          contactPhone: user.phone || '',
          address: null,
          preferredContactMethod: 'email'
        });

      } else if (role === ROLES.STUDENT) {
        roleSpecificDoc = await Student.create({
          user: user._id,
          // Empty fields - will be filled later
          family: null,
          name: user.name,
          dateOfBirth: null,
          gradeLevel: '',
          subjects: []
        });

      } else if (role === ROLES.MENTOR) {
        // Create mentor with minimal required fields - expertise is now optional for initial creation
        roleSpecificDoc = await Mentor.create({
          user: user._id,
          // Empty fields - will be filled later during profile completion
          bio: '',
          expertise: [], // Empty array is now allowed
          qualifications: [],
          experience: { years: 0, description: '' },
          education: [],
          hourlyRate: 0,
          availability: [],
          subjects: []
        });
      }

      // Generate Tokens
      const tokens = TokenService.generateAuthTokens(user);

      return {
        user: user.toJSON(),
        profile: roleSpecificDoc,
        tokens,
      };

    } catch (error) {
      // Rollback: Delete user if profile creation fails
      await User.findByIdAndDelete(user._id);
      throw error;
    }
  }

  /**
   * Create role-specific profile after registration (for empty profiles)
   */
  static async createRoleProfile(userId, role, profileData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    let roleSpecificDoc;
    let updateData = {};

    switch (role) {
      case ROLES.FAMILY:
        if (!profileData.familyName || !profileData.address) {
          throw new AppError('Family name and address are required', StatusCodes.BAD_REQUEST);
        }
        updateData = {
          familyName: profileData.familyName.trim(),
          contactPhone: profileData.contactPhone?.trim() || user.phone,
          address: profileData.address,
          preferredContactMethod: profileData.preferredContactMethod || 'email',
          timezone: profileData.timezone || 'America/New_York'
        };
        roleSpecificDoc = await Family.findOneAndUpdate(
          { user: userId },
          { $set: updateData },
          { new: true, runValidators: true }
        );
        break;

      case ROLES.STUDENT:
        if (!profileData.dateOfBirth || !profileData.gradeLevel || !profileData.familyId) {
          throw new AppError('Date of birth, grade level, and family ID are required', StatusCodes.BAD_REQUEST);
        }
        updateData = {
          family: profileData.familyId,
          dateOfBirth: new Date(profileData.dateOfBirth),
          gradeLevel: profileData.gradeLevel,
          subjects: profileData.subjects || []
        };
        roleSpecificDoc = await Student.findOneAndUpdate(
          { user: userId },
          { $set: updateData },
          { new: true, runValidators: true }
        );
        break;

      case ROLES.MENTOR:
        // VALIDATE: At least one expertise is required when completing profile
        if (!profileData.expertise || !Array.isArray(profileData.expertise) || profileData.expertise.length === 0) {
          throw new AppError('At least one expertise area is required', StatusCodes.BAD_REQUEST);
        }

        let safeExperience = { years: 0, description: '' };
        if (profileData.experience !== undefined && profileData.experience !== null) {
          if (typeof profileData.experience === 'number') {
            safeExperience = { years: profileData.experience, description: '' };
          } else if (typeof profileData.experience === 'object') {
            safeExperience = profileData.experience;
          }
        }

        updateData = {
          bio: profileData.bio?.trim() || '',
          expertise: profileData.expertise, // Now validated here
          qualifications: profileData.qualifications || [],
          experience: safeExperience,
          education: profileData.education || [],
          hourlyRate: profileData.hourlyRate || 0,
          availability: profileData.availability || [],
          subjects: profileData.subjects || []
        };
        roleSpecificDoc = await Mentor.findOneAndUpdate(
          { user: userId },
          { $set: updateData },
          { new: true, runValidators: true }
        );
        break;

      default:
        throw new AppError('Invalid role for profile creation', StatusCodes.BAD_REQUEST);
    }

    if (!roleSpecificDoc) {
      throw new AppError(`${role} profile not found`, StatusCodes.NOT_FOUND);
    }

    return {
      user: user.toJSON(),
      profile: roleSpecificDoc
    };
  }

  /**
   * Create role-specific profile after registration (for empty profiles)
   */
  static async createRoleProfile(userId, role, profileData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    let roleSpecificDoc;
    let updateData = {};

    switch (role) {
      case ROLES.FAMILY:
        if (!profileData.familyName || !profileData.address) {
          throw new AppError('Family name and address are required', StatusCodes.BAD_REQUEST);
        }
        updateData = {
          familyName: profileData.familyName.trim(),
          contactPhone: profileData.contactPhone?.trim() || user.phone,
          address: profileData.address,
          preferredContactMethod: profileData.preferredContactMethod || 'email',
          timezone: profileData.timezone || 'America/New_York'
        };
        roleSpecificDoc = await Family.findOneAndUpdate(
          { user: userId },
          { $set: updateData },
          { new: true, runValidators: true }
        );
        break;

      case ROLES.STUDENT:
        if (!profileData.dateOfBirth || !profileData.gradeLevel || !profileData.familyId) {
          throw new AppError('Date of birth, grade level, and family ID are required', StatusCodes.BAD_REQUEST);
        }
        updateData = {
          family: profileData.familyId,
          dateOfBirth: new Date(profileData.dateOfBirth),
          gradeLevel: profileData.gradeLevel,
          subjects: profileData.subjects || []
        };
        roleSpecificDoc = await Student.findOneAndUpdate(
          { user: userId },
          { $set: updateData },
          { new: true, runValidators: true }
        );
        break;

      case ROLES.MENTOR:
        if (!profileData.expertise || !Array.isArray(profileData.expertise) || profileData.expertise.length === 0) {
          throw new AppError('At least one expertise area is required', StatusCodes.BAD_REQUEST);
        }

        let safeExperience = { years: 0, description: '' };
        if (profileData.experience !== undefined && profileData.experience !== null) {
          if (typeof profileData.experience === 'number') {
            safeExperience = { years: profileData.experience, description: '' };
          } else if (typeof profileData.experience === 'object') {
            safeExperience = profileData.experience;
          }
        }

        updateData = {
          bio: profileData.bio?.trim() || '',
          expertise: profileData.expertise,
          qualifications: profileData.qualifications || [],
          experience: safeExperience,
          education: profileData.education || [],
          hourlyRate: profileData.hourlyRate || 0,
          availability: profileData.availability || [],
          subjects: profileData.subjects || []
        };
        roleSpecificDoc = await Mentor.findOneAndUpdate(
          { user: userId },
          { $set: updateData },
          { new: true, runValidators: true }
        );
        break;

      default:
        throw new AppError('Invalid role for profile creation', StatusCodes.BAD_REQUEST);
    }

    if (!roleSpecificDoc) {
      throw new AppError(`${role} profile not found`, StatusCodes.NOT_FOUND);
    }

    return {
      user: user.toJSON(),
      profile: roleSpecificDoc
    };
  }

  /**
   * Login user
   */
  static async login(email, password) {
    if (!email || !password) {
      throw new AppError('Email and password are required', StatusCodes.BAD_REQUEST);
    }

    const user = await User.findActiveByEmail(email);
    if (!user || !(await PasswordService.comparePassword(password, user.password))) {
      throw new AppError(AUTH_ERRORS.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const tokens = TokenService.generateAuthTokens(user);

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  /**
   * Get current user by ID with full profile
   */
  static async getUserWithProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    let profileData = null;

    switch (user.role) {
      case ROLES.FAMILY:
        profileData = await Family.findOne({ user: userId })
          .populate('students', 'name gradeLevel subjects dateOfBirth');
        break;
      case ROLES.STUDENT:
        profileData = await Student.findOne({ user: userId })
          .populate('family', 'familyName contactPhone address');
        break;
      case ROLES.MENTOR:
        profileData = await Mentor.findOne({ user: userId });
        break;
    }

    return {
      user: user.toJSON(),
      profile: profileData
    };
  }

  /**
   * Update user profile (common + role-specific data)
   */
  static async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const { commonData, profileData } = updateData;

    // Update common user data
    if (commonData) {
      if (commonData.name) user.name = commonData.name;
      if (commonData.phone) user.phone = commonData.phone;
      await user.save();
    }

    // Update role-specific profile data
    if (profileData) {
      let Model;
      switch (user.role) {
        case ROLES.FAMILY: Model = Family; break;
        case ROLES.STUDENT: Model = Student; break;
        case ROLES.MENTOR: Model = Mentor; break;
      }

      if (Model) {
        await Model.findOneAndUpdate(
          { user: userId },
          { $set: profileData },
          { new: true, runValidators: true }
        );
      }
    }

    return await this.getUserWithProfile(userId);
  }

  /**
   * Check if user profile is complete
   */
  static async isProfileComplete(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(AUTH_ERRORS.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    let profile;
    switch (user.role) {
      case ROLES.MENTOR:
        profile = await Mentor.findOne({ user: userId });
        return profile && profile.profileCompletion > 70; // Example threshold
      case ROLES.FAMILY:
        profile = await Family.findOne({ user: userId });
        return profile && profile.familyName && profile.address;
      case ROLES.STUDENT:
        profile = await Student.findOne({ user: userId });
        return profile && profile.dateOfBirth && profile.gradeLevel && profile.family;
      default:
        return true;
    }
  }
}