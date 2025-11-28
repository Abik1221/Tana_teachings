import Job from '../../models/Job.js';
import Application from '../../models/Application.js';
import User from '../../models/User.js';
import AppError from '../../utils/errors/AppError.js';

export class AdminJobService {
  /**
   * Get all jobs with advanced filtering for admin
   */
  static async getJobs(query) {
    const {
      status,
      priority,
      urgency,
      family,
      subject,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (urgency) filter.urgency = urgency;
    if (family) filter.family = family;
    if (subject) filter.subjects = { $in: [subject] };
    
    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Execute query with population
    const jobs = await Job.find(filter)
      .populate('family', 'familyName contactPhone')
      .populate('student', 'name gradeLevel')
      .populate('adminReview.reviewedBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    return {
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get pending jobs for admin review
   */
  static async getPendingJobs(query = {}) {
    return this.getJobs({
      ...query,
      status: 'pending_approval'
    });
  }

  /**
   * Approve a job post
   */
  static async approveJob(jobId, adminId, notes = '') {
    const job = await Job.findById(jobId);
    
    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (!job.canBeApproved()) {
      throw new AppError('Job is not pending approval', 400);
    }

    job.status = 'open';
    job.adminReview = {
      reviewedBy: adminId,
      reviewedAt: new Date(),
      notes
    };

    await job.save();

    // Populate for response
    return await Job.findById(jobId)
      .populate('family', 'familyName contactPhone')
      .populate('student', 'name gradeLevel')
      .populate('adminReview.reviewedBy', 'name email');
  }

  /**
   * Reject a job post
   */
  static async rejectJob(jobId, adminId, rejectionReason, notes = '') {
    const job = await Job.findById(jobId);
    
    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (!job.canBeApproved()) {
      throw new AppError('Job is not pending approval', 400);
    }

    if (!rejectionReason) {
      throw new AppError('Rejection reason is required', 400);
    }

    job.status = 'rejected';
    job.adminReview = {
      reviewedBy: adminId,
      reviewedAt: new Date(),
      notes,
      rejectionReason
    };

    await job.save();

    return await Job.findById(jobId)
      .populate('family', 'familyName contactPhone')
      .populate('adminReview.reviewedBy', 'name email');
  }

  /**
   * Get job statistics for admin dashboard
   */
  static async getJobStats(timeframe = '30d') {
    const dateFilter = this.getDateFilter(timeframe);
    
    const stats = await Job.aggregate([
      {
        $match: {
          createdAt: dateFilter
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgBudget: { $avg: '$budget' }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          avgBudget: { $round: ['$avgBudget', 2] },
          _id: 0
        }
      }
    ]);

    const totalJobs = await Job.countDocuments({ createdAt: dateFilter });
    const pendingJobs = await Job.countDocuments({ 
      status: 'pending_approval',
      createdAt: dateFilter
    });

    return {
      totalJobs,
      pendingJobs,
      statusBreakdown: stats,
      timeframe
    };
  }

  static getDateFilter(timeframe) {
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case '7d':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30));
    }

    return { $gte: startDate };
  }

  /**
   * Get single job by ID
   */
  static async getJobById(jobId) {
    const job = await Job.findById(jobId)
      .populate('family', 'familyName contactPhone')
      .populate('student', 'name gradeLevel')
      .populate('adminReview.reviewedBy', 'name email');

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    return job;
  }

  /**
   * Get applications for a given job
   */
  static async getJobApplications(jobId) {
    const applications = await Application.find({ job: jobId })
      .populate('student', 'name email gradeLevel')
      .populate('job', 'title family');

    return applications;
  }

  /**
   * Update job priority
   */
  static async updateJobPriority(jobId, priority) {
    const job = await Job.findById(jobId);

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    job.priority = priority;
    await job.save();

    return await Job.findById(jobId)
      .populate('family', 'familyName contactPhone')
      .populate('student', 'name gradeLevel');
  }
}