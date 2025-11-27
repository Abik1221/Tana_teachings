import User from '../../models/User.js';
import Family from '../../models/Family.js';
import Student from '../../models/Student.js';
import Mentor from '../../models/Mentor.js';
import { ROLES, USER_STATUS } from '../../config/constants.js';
import AppError from '../../utils/errors/AppError.js';

export class AdminUserService {
  /**
   * Get all users with filtering by role and status
   */
  static async getUsers(query) {
    const {
      role,
      status,
      search,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = query;

    // Build filter object
    const filter = {};
    
    if (role) filter.role = role;
    if (status) filter.status = status;
    
    // Search filter (name or email)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    return {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get user by ID with complete profile
   */
  static async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    let profile = null;

    // Get role-specific profile
    switch (user.role) {
      case ROLES.FAMILY:
        profile = await Family.findOne({ user: userId })
          .populate('students');
        break;
      case ROLES.STUDENT:
        profile = await Student.findOne({ user: userId })
          .populate('family');
        break;
      case ROLES.MENTOR:
        profile = await Mentor.findOne({ user: userId });
        break;
    }

    return {
      user,
      profile
    };
  }

  /**
   * Update user status (activate/suspend)
   */
  static async updateUserStatus(userId, status, adminId = null, adminNotes = '') {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!Object.values(USER_STATUS).includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    user.status = status;
    
    // Add admin note
    if (adminNotes) {
      user.adminNotes = user.adminNotes || [];
      user.adminNotes.push({
        note: adminNotes,
        adminId: adminId,
        createdAt: new Date()
      });
    }

    await user.save();

    return await User.findById(userId).select('-password');
  }

  /**
   * Delete user (soft delete)
   */
  static async deleteUser(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Soft delete by setting status to inactive
    user.status = USER_STATUS.INACTIVE;
    user.email = `deleted_${Date.now()}_${user.email}`; // Prevent email reuse
    await user.save();

    return { message: 'User deleted successfully' };
  }

  /**
   * Get platform statistics
   */
  static async getPlatformStats() {
    const [
      totalUsers,
      totalFamilies,
      totalStudents,
      totalMentors,
      activeUsers,
      suspendedUsers,
      userStatsByRole
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: ROLES.FAMILY }),
      User.countDocuments({ role: ROLES.STUDENT }),
      User.countDocuments({ role: ROLES.MENTOR }),
      User.countDocuments({ status: USER_STATUS.ACTIVE }),
      User.countDocuments({ status: USER_STATUS.SUSPENDED }),
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            active: {
              $sum: { $cond: [{ $eq: ['$status', USER_STATUS.ACTIVE] }, 1, 0] }
            }
          }
        }
      ])
    ]);

    return {
      totalUsers,
      userBreakdown: {
        families: totalFamilies,
        students: totalStudents,
        mentors: totalMentors,
        admins: await User.countDocuments({ role: ROLES.ADMIN })
      },
      statusBreakdown: {
        active: activeUsers,
        inactive: await User.countDocuments({ status: USER_STATUS.INACTIVE }),
        suspended: suspendedUsers,
        pending: await User.countDocuments({ status: USER_STATUS.PENDING })
      },
      userStatsByRole
    };
  }
}
