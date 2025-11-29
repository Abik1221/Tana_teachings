import Application from '../../models/Application.js';
import Job from '../../models/Job.js';
import Mentor from '../../models/Mentor.js';
import AppError from '../../utils/errors/AppError.js';
import { StatusCodes } from 'http-status-codes';

export class MentorApplicationService {
  /**
   * Apply to a job
   */
  static async applyToJob(applicationData) {
    const { jobId, mentorId, applicationText, whyFit, proposedApproach } = applicationData;

    // Validate job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      throw new AppError('Job not found', StatusCodes.NOT_FOUND);
    }

    if (job.status !== 'open') {
      throw new AppError('Job is not accepting applications', StatusCodes.BAD_REQUEST);
    }

    // Check if mentor has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      mentor: mentorId,
      isActive: true
    });

    if (existingApplication) {
      throw new AppError('You have already applied to this job', StatusCodes.CONFLICT);
    }

    // Validate mentor profile completeness
    const mentor = await Mentor.findOne({ user: mentorId });
    if (!mentor) {
      throw new AppError('Mentor profile not found', StatusCodes.NOT_FOUND);
    }

    if (mentor.profileCompletion < 50) {
      throw new AppError('Please complete your profile before applying to jobs', StatusCodes.BAD_REQUEST);
    }

    // Create application
    const application = new Application({
      job: jobId,
      mentor: mentorId,
      applicationText,
      whyFit,
      proposedApproach: proposedApproach || '',
      status: 'pending_vetting',
      appliedAt: new Date()
    });

    await application.save();

    // Update mentor stats
    await mentor.addApplication();

    // Populate and return application
    return await Application.findById(application._id)
      .populate('job', 'title family student subjects budget')
      .populate('mentor', 'name email')
      .populate('adminReview.reviewedBy', 'name email');
  }

  /**
   * Get mentor's applications with filtering
   */
  static async getMentorApplications(mentorId, query) {
    const {
      status,
      jobId,
      dateFrom,
      dateTo,
      sort = '-appliedAt',
      page = 1,
      limit = 10
    } = query;

    const filter = {
      mentor: mentorId,
      isActive: true
    };

    if (status) filter.status = status;
    if (jobId) filter.job = jobId;

    if (dateFrom || dateTo) {
      filter.appliedAt = {};
      if (dateFrom) filter.appliedAt.$gte = new Date(dateFrom);
      if (dateTo) filter.appliedAt.$lte = new Date(dateTo);
    }

    const applications = await Application.find(filter)
      .populate({
        path: 'job',
        populate: [
          { path: 'family', select: 'familyName contactPhone' },
          { path: 'student', select: 'name gradeLevel' }
        ]
      })
      .populate('adminReview.reviewedBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    // Get application statistics
    const stats = await this.getApplicationStatistics(mentorId);

    return {
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      stats
    };
  }

  /**
   * Get application by ID with authorization
   */
  static async getApplicationById(applicationId, mentorId) {
    const application = await Application.findOne({
      _id: applicationId,
      mentor: mentorId,
      isActive: true
    })
      .populate({
        path: 'job',
        populate: [
          { path: 'family', select: 'familyName contactPhone address' },
          { path: 'student', select: 'name gradeLevel learningGoals challenges' }
        ]
      })
      .populate('adminReview.reviewedBy', 'name email');

    if (!application) {
      throw new AppError('Application not found', StatusCodes.NOT_FOUND);
    }

    return application;
  }

  /**
   * Update application (only allowed for pending applications)
   */
  static async updateApplication(applicationId, mentorId, updateData) {
    const application = await Application.findOne({
      _id: applicationId,
      mentor: mentorId,
      isActive: true
    });

    if (!application) {
      throw new AppError('Application not found', StatusCodes.NOT_FOUND);
    }

    // Only allow updates for pending applications
    if (application.status !== 'pending_vetting') {
      throw new AppError('Cannot update application after it has been reviewed', StatusCodes.BAD_REQUEST);
    }

    // Only allow certain fields to be updated
    const allowedUpdates = ['applicationText', 'whyFit', 'proposedApproach'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      updates,
      { new: true, runValidators: true }
    )
      .populate({
        path: 'job',
        populate: [
          { path: 'family', select: 'familyName contactPhone' },
          { path: 'student', select: 'name gradeLevel' }
        ]
      });

    return updatedApplication;
  }

  /**
   * Withdraw application
   */
  static async withdrawApplication(applicationId, mentorId) {
    const application = await Application.findOne({
      _id: applicationId,
      mentor: mentorId,
      isActive: true
    });

    if (!application) {
      throw new AppError('Application not found', StatusCodes.NOT_FOUND);
    }

    // Only allow withdrawal for pending applications
    if (application.status !== 'pending_vetting') {
      throw new AppError('Cannot withdraw application after it has been reviewed', StatusCodes.BAD_REQUEST);
    }

    application.isActive = false;
    await application.save();

    return application;
  }

  /**
   * Get application statistics for mentor
   */
  static async getApplicationStats(mentorId) {
    const stats = await Application.aggregate([
      {
        $match: {
          mentor: mentorId,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await Application.countDocuments({
      mentor: mentorId,
      isActive: true
    });

    const hiredApplications = await Application.countDocuments({
      mentor: mentorId,
      status: 'hired',
      isActive: true
    });

    const successRate = totalApplications > 0 ? 
      (hiredApplications / totalApplications * 100).toFixed(1) : 0;

    const statusBreakdown = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    return {
      total: totalApplications,
      hired: hiredApplications,
      successRate: parseFloat(successRate),
      statusBreakdown
    };
  }

  /**
   * Check if mentor has already applied to a job
   */
  static async checkIfApplied(jobId, mentorId) {
    const application = await Application.findOne({
      job: jobId,
      mentor: mentorId,
      isActive: true
    });

    return !!application;
  }

  /**
   * Get application statistics
   */
  static async getApplicationStatistics(mentorId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentStats = await Application.aggregate([
      {
        $match: {
          mentor: mentorId,
          appliedAt: { $gte: thirtyDaysAgo },
          isActive: true
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRecent = recentStats.reduce((sum, stat) => sum + stat.count, 0);

    return {
      recent: {
        total: totalRecent,
        breakdown: recentStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      },
      timeframe: '30d'
    };
  }
}