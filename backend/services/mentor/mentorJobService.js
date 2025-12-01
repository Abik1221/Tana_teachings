import Job from '../../models/Job.js';
import Application from '../../models/Application.js';
import Mentor from '../../models/Mentor.js';
import SavedJob from '../../models/SavedJob.js';
import AppError from '../../utils/errors/AppError.js';
import { StatusCodes } from 'http-status-codes';

export class MentorJobService {
  /**
   * Get available jobs for mentors with filtering
   */
  static async getAvailableJobs(query, mentorId) {
    const {
      subjects,
      gradeLevel,
      budgetMin,
      budgetMax,
      status = 'open',
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = query;

    // Build filter object
    const filter = {
      status: 'open',
      isActive: true
    };

    // Subject filter
    if (subjects) {
      const subjectArray = Array.isArray(subjects) ? subjects : [subjects];
      filter.subjects = { $in: subjectArray };
    }

    // Grade level filter
    if (gradeLevel) {
      filter.gradeLevel = gradeLevel;
    }

    // Budget filter
    if (budgetMin || budgetMax) {
      filter.budget = {};
      if (budgetMin) filter.budget.$gte = parseInt(budgetMin);
      if (budgetMax) filter.budget.$lte = parseInt(budgetMax);
    }

    // Get mentor's expertise for recommendations
    const mentor = await Mentor.findOne({ user: mentorId }).select('expertise subjects');
    let recommendedJobs = [];

    // Execute query
    const jobs = await Job.find(filter)
      .populate('family', 'familyName contactPhone address')
      .populate('student', 'name gradeLevel')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(filter);

    // Check which jobs mentor has already applied to
    const jobIds = jobs.map(job => job._id);
    const applications = await Application.find({
      job: { $in: jobIds },
      mentor: mentorId
    }).select('job');

    const appliedJobIds = new Set(applications.map(app => app.job.toString()));

    // Add application status to each job
    const jobsWithStatus = jobs.map(job => ({
      ...job.toObject(),
      hasApplied: appliedJobIds.has(job._id.toString())
    }));

    return {
      jobs: jobsWithStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        subjects: await this.getAvailableSubjects(),
        gradeLevels: await this.getAvailableGradeLevels()
      }
    };
  }

  /**
   * Get job by ID with application status
   */
  static async getJobById(jobId, mentorId) {
    const job = await Job.findById(jobId)
      .populate('family', 'familyName contactPhone address preferredContactMethod')
      .populate('student', 'name gradeLevel learningGoals challenges');

    if (!job) {
      throw new AppError('Job not found', StatusCodes.NOT_FOUND);
    }

    if (job.status !== 'open') {
      throw new AppError('Job is not available for applications', StatusCodes.BAD_REQUEST);
    }

    // Check if mentor has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      mentor: mentorId
    });

    return {
      ...job.toObject(),
      hasApplied: !!existingApplication,
      applicationId: existingApplication?._id
    };
  }

  /**
   * Get recommended jobs based on mentor's profile
   */
  static async getRecommendedJobs(mentorId, query = {}) {
    const mentor = await Mentor.findOne({ user: mentorId })
      .select('expertise subjects hourlyRate');
    
    if (!mentor) {
      throw new AppError('Mentor profile not found', StatusCodes.NOT_FOUND);
    }

    const { limit = 5 } = query;

    // Build recommendation query based on mentor's expertise and subjects
    const recommendationQuery = {
      status: 'open',
      isActive: true,
      $or: [
        { subjects: { $in: mentor.expertise } },
        { subjects: { $in: mentor.subjects.map(s => s.subject) } }
      ]
    };

    const jobs = await Job.find(recommendationQuery)
      .populate('family', 'familyName contactPhone')
      .populate('student', 'name gradeLevel')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Check application status
    const jobIds = jobs.map(job => job._id);
    const applications = await Application.find({
      job: { $in: jobIds },
      mentor: mentorId
    }).select('job');

    const appliedJobIds = new Set(applications.map(app => app.job.toString()));

    return jobs.map(job => ({
      ...job.toObject(),
      hasApplied: appliedJobIds.has(job._id.toString()),
      matchScore: this.calculateMatchScore(job, mentor)
    }));
  }

  /**
   * Search jobs with advanced filters
   */
  static async searchJobs(query, mentorId) {
    const {
      q: searchTerm,
      subjects,
      gradeLevel,
      budgetMin,
      budgetMax,
      location,
      sort = 'relevance',
      page = 1,
      limit = 10
    } = query;

    const filter = {
      status: 'open',
      isActive: true
    };

    // Text search
    if (searchTerm) {
      filter.$text = { $search: searchTerm };
    }

    // Additional filters
    if (subjects) {
      const subjectArray = Array.isArray(subjects) ? subjects : [subjects];
      filter.subjects = { $in: subjectArray };
    }

    if (gradeLevel) filter.gradeLevel = gradeLevel;
    if (location) filter['family.address.city'] = new RegExp(location, 'i');

    if (budgetMin || budgetMax) {
      filter.budget = {};
      if (budgetMin) filter.budget.$gte = parseInt(budgetMin);
      if (budgetMax) filter.budget.$lte = parseInt(budgetMax);
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'relevance':
        if (searchTerm) {
          sortOption = { score: { $meta: 'textScore' } };
        } else {
          sortOption = { createdAt: -1 };
        }
        break;
      case 'budget_high':
        sortOption = { budget: -1 };
        break;
      case 'budget_low':
        sortOption = { budget: 1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const findQuery = searchTerm ? 
      Job.find(filter, { score: { $meta: 'textScore' } }) : 
      Job.find(filter);

    const jobs = await findQuery
      .populate('family', 'familyName contactPhone address')
      .populate('student', 'name gradeLevel')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(filter);

    // Check application status
    const jobIds = jobs.map(job => job._id);
    const applications = await Application.find({
      job: { $in: jobIds },
      mentor: mentorId
    }).select('job');

    const appliedJobIds = new Set(applications.map(app => app.job.toString()));

    const jobsWithStatus = jobs.map(job => ({
      ...job.toObject(),
      hasApplied: appliedJobIds.has(job._id.toString())
    }));

    return {
      jobs: jobsWithStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      searchMeta: {
        searchTerm,
        filters: {
          subjects,
          gradeLevel,
          budget: { min: budgetMin, max: budgetMax },
          location
        },
        sort,
        totalResults: total
      }
    };
  }

  /**
   * Save job for later
   */
  static async saveJob(jobId, mentorId) {
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'open') {
      throw new AppError('Job not found or not available', StatusCodes.NOT_FOUND);
    }

    // Check if already saved
    const existingSave = await SavedJob.findOne({
      job: jobId,
      mentor: mentorId
    });

    if (existingSave) {
      throw new AppError('Job already saved', StatusCodes.BAD_REQUEST);
    }

    const savedJob = new SavedJob({
      job: jobId,
      mentor: mentorId
    });

    await savedJob.save();
    return savedJob;
  }

  /**
   * Get saved jobs
   */
  static async getSavedJobs(mentorId, query = {}) {
    const { page = 1, limit = 10 } = query;

    const savedJobs = await SavedJob.find({ mentor: mentorId })
      .populate({
        path: 'job',
        populate: [
          { path: 'family', select: 'familyName contactPhone' },
          { path: 'student', select: 'name gradeLevel' }
        ]
      })
      .sort({ savedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SavedJob.countDocuments({ mentor: mentorId });

    // Filter out jobs that are no longer open
    const validSavedJobs = savedJobs.filter(savedJob => 
      savedJob.job && savedJob.job.status === 'open'
    );

    return {
      jobs: validSavedJobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: validSavedJobs.length,
        pages: Math.ceil(validSavedJobs.length / limit)
      }
    };
  }

  /**
   * Remove saved job
   */
  static async removeSavedJob(jobId, mentorId) {
    const result = await SavedJob.findOneAndDelete({
      job: jobId,
      mentor: mentorId
    });

    if (!result) {
      throw new AppError('Saved job not found', StatusCodes.NOT_FOUND);
    }

    return result;
  }

  /**
   * Calculate match score between job and mentor
   */
  static calculateMatchScore(job, mentor) {
    let score = 0;
    const maxScore = 100;

    // Subject match (40 points)
    const subjectMatches = job.subjects.filter(subject => 
      mentor.expertise.includes(subject) || 
      mentor.subjects.some(s => s.subject === subject)
    ).length;
    
    score += (subjectMatches / job.subjects.length) * 40;

    // Budget compatibility (30 points)
    if (mentor.hourlyRate > 0) {
      const budgetRatio = job.budget / mentor.hourlyRate;
      if (budgetRatio >= 1) score += 30;
      else if (budgetRatio >= 0.8) score += 20;
      else if (budgetRatio >= 0.6) score += 10;
    }

    // Grade level experience (20 points)
    // This would require additional data about mentor's grade level experience

    // Profile completeness (10 points)
    score += (mentor.profileCompletion / 100) * 10;

    return Math.min(Math.round(score), maxScore);
  }

  /**
   * Get available subjects for filtering
   */
  static async getAvailableSubjects() {
    const subjects = await Job.distinct('subjects', { 
      status: 'open', 
      isActive: true 
    });
    return subjects.sort();
  }

  /**
   * Get available grade levels for filtering
   */
  static async getAvailableGradeLevels() {
    const gradeLevels = await Job.distinct('gradeLevel', { 
      status: 'open', 
      isActive: true 
    });
    return gradeLevels.sort();
  }
}