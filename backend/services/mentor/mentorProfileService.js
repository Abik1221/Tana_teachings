import Mentor from '../../models/Mentor.js'
import User from '../../models/User.js';
import AppError from '../../utils/errors/AppError.js';
import { StatusCodes } from 'http-status-codes';

export class MentorProfileService {
  /**
   * Get mentor profile by user ID
   */
  static async getMentorProfile(userId) {
    const mentor = await Mentor.findOne({ user: userId })
      .populate('user', 'name email avatar phone status lastLogin')
      .populate('rating.reviews.student', 'name');

    if (!mentor) {
      throw new AppError('Mentor profile not found', StatusCodes.NOT_FOUND);
    }

    return mentor;
  }

  /**
   * Create or update mentor profile
   */
  static async createOrUpdateProfile(userId, profileData) {
    // Check if user exists and is a mentor
    const user = await User.findById(userId);
    if (!user || user.role !== 'mentor') {
      throw new AppError('User not found or not a mentor', StatusCodes.BAD_REQUEST);
    }

    let mentor = await Mentor.findOne({ user: userId });

    if (mentor) {
      // Update existing profile
      mentor = await Mentor.findOneAndUpdate(
        { user: userId },
        { 
          $set: profileData,
          $currentDate: { lastActive: true }
        },
        { 
          new: true, 
          runValidators: true,
          context: 'query'
        }
      ).populate('user', 'name email avatar');
    } else {
      // Create new profile
      mentor = new Mentor({
        user: userId,
        ...profileData
      });
      await mentor.save();
      mentor = await mentor.populate('user', 'name email avatar');
    }

    return mentor;
  }

  /**
   * Update mentor availability
   */
  static async updateAvailability(userId, availability) {
    const mentor = await Mentor.findOneAndUpdate(
      { user: userId },
      { 
        $set: { availability },
        $currentDate: { lastActive: true }
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('user', 'name email avatar');

    if (!mentor) {
      throw new AppError('Mentor profile not found', StatusCodes.NOT_FOUND);
    }

    return mentor;
  }

  /**
   * Update mentor subjects and expertise
   */
  static async updateSubjects(userId, { subjects, expertise }) {
    const updateData = {};
    
    if (subjects) updateData.subjects = subjects;
    if (expertise) updateData.expertise = expertise;

    const mentor = await Mentor.findOneAndUpdate(
      { user: userId },
      { 
        $set: updateData,
        $currentDate: { lastActive: true }
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('user', 'name email avatar');

    if (!mentor) {
      throw new AppError('Mentor profile not found', StatusCodes.NOT_FOUND);
    }

    return mentor;
  }

  /**
   * Update hourly rate
   */
  static async updateHourlyRate(userId, hourlyRate) {
    const mentor = await Mentor.findOneAndUpdate(
      { user: userId },
      { 
        $set: { hourlyRate },
        $currentDate: { lastActive: true }
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('user', 'name email avatar');

    if (!mentor) {
      throw new AppError('Mentor profile not found', StatusCodes.NOT_FOUND);
    }

    return mentor;
  }

  /**
   * Update search visibility
   */
  static async updateVisibility(userId, searchVisibility) {
    const mentor = await Mentor.findOneAndUpdate(
      { user: userId },
      { 
        $set: { searchVisibility },
        $currentDate: { lastActive: true }
      },
      { 
        new: true 
      }
    ).populate('user', 'name email avatar');

    if (!mentor) {
      throw new AppError('Mentor profile not found', StatusCodes.NOT_FOUND);
    }

    return mentor;
  }

  /**
   * Get mentor statistics
   */
  static async getMentorStats(userId) {
    const mentor = await Mentor.findOne({ user: userId })
      .select('stats profileCompletion rating hourlyRate')
      .populate('user', 'name email');

    if (!mentor) {
      throw new AppError('Mentor profile not found', StatusCodes.NOT_FOUND);
    }

    const stats = {
      profileCompletion: mentor.profileCompletion,
      hourlyRate: mentor.hourlyRate,
      rating: mentor.rating,
      applications: {
        total: mentor.stats.totalApplications,
        hired: mentor.stats.hiredApplications,
        successRate: mentor.successRate
      },
      sessions: {
        completed: mentor.stats.completedSessions,
        satisfaction: mentor.stats.studentSatisfaction
      }
    };

    return stats;
  }

  /**
   * Upload qualification document
   */
  static async uploadQualificationDocument(userId, qualificationId, file) {
    const mentor = await Mentor.findOne({ user: userId });
    
    if (!mentor) {
      throw new AppError('Mentor profile not found', StatusCodes.NOT_FOUND);
    }

    // Find the qualification and update document URL
    const qualification = mentor.qualifications.id(qualificationId);
    if (!qualification) {
      throw new AppError('Qualification not found', StatusCodes.NOT_FOUND);
    }

    qualification.documentUrl = `/uploads/qualifications/${file.filename}`;
    await mentor.save();

    return mentor;
  }

  /**
   * Get mentor by ID (for internal use)
   */
  static async getMentorById(mentorId) {
    return await Mentor.findById(mentorId)
      .populate('user', 'name email avatar phone');
  }

  /**
   * Find mentors by expertise
   */
  static async findMentorsByExpertise(expertise, options = {}) {
    const { limit = 10, page = 1 } = options;
    
    const query = {
      expertise: { $in: [expertise] },
      isActive: true,
      searchVisibility: true,
      profileCompletion: { $gte: 70 }
    };

    const mentors = await Mentor.find(query)
      .populate('user', 'name email avatar')
      .sort({ rating: -1, profileCompletion: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Mentor.countDocuments(query);

    return {
      mentors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}