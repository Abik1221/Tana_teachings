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
  /**
   * Register a new user and create role-specific document
   * Uses Manual Rollback (Try/Catch/Delete) to support standalone MongoDB
   */
  static async register(userData) {
    const { name, email, password, role, phone, profileData } = userData;

    // 1. Basic Validation
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

    // 4. Create User (Common Data)
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

    // 5. Create Role-Specific Document
    let roleSpecificDoc;

    try {
      if (role === ROLES.FAMILY) {
        if (!profileData?.familyName || !profileData?.address) {
          throw new AppError('Family name and address are required', StatusCodes.BAD_REQUEST);
        }

        roleSpecificDoc = await Family.create({
          user: user._id,
          familyName: profileData.familyName.trim(),
          contactPhone: profileData.contactPhone?.trim() || user.phone,
          address: profileData.address,
          preferredContactMethod: profileData.preferredContactMethod || 'email',
        });

      } else if (role === ROLES.STUDENT) {
        if (!profileData?.dateOfBirth || !profileData?.gradeLevel || !profileData?.familyId) {
          throw new AppError('DOB, grade level, and family ID are required', StatusCodes.BAD_REQUEST);
        }

        const family = await Family.findById(profileData.familyId);
        if (!family) {
          throw new AppError('Family not found', StatusCodes.BAD_REQUEST);
        }

        roleSpecificDoc = await Student.create({
          user: user._id,
          family: profileData.familyId,
          name: user.name,
          dateOfBirth: new Date(profileData.dateOfBirth),
          gradeLevel: profileData.gradeLevel,
          subjects: profileData.subjects || []
        });

      } else if (role === ROLES.MENTOR) {
        if (!profileData?.expertise || !Array.isArray(profileData.expertise) || profileData.expertise.length === 0) {
          throw new AppError('At least one expertise area is required', StatusCodes.BAD_REQUEST);
        }

        roleSpecificDoc = await Mentor.create({
          user: user._id,
          bio: profileData.bio?.trim() || '',
          expertise: profileData.expertise,
          qualifications: profileData.qualifications || [],
          experience: profileData.experience || 0,
          education: profileData.education || [],
          hourlyRate: profileData.hourlyRate || 0,
          availability: profileData.availability || [],
          subjects: profileData.subjects || []
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
      // MANUAL ROLLBACK: If profile creation fails, delete the User we just created
      // This prevents "orphan" users who have no profile data
      await User.findByIdAndDelete(user._id);
      
      throw error;
    }
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
   * Create a student user by family (for family creating their children)
   */
  static async createStudentByFamily(familyUserId, studentData) {
    const familyUser = await User.findById(familyUserId);
    if (!familyUser || familyUser.role !== ROLES.FAMILY) {
      throw new AppError('Only Family accounts can create students', StatusCodes.FORBIDDEN);
    }

    const familyDoc = await Family.findOne({ user: familyUserId });
    if (!familyDoc) {
      throw new AppError('Family profile not found', StatusCodes.NOT_FOUND);
    }

    const registrationData = {
      ...studentData,
      role: ROLES.STUDENT,
      profileData: {
        ...studentData.profileData,
        familyId: familyDoc._id
      }
    };

    return await this.register(registrationData);
  }
}