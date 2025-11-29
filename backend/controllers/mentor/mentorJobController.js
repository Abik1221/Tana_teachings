import { MentorJobService } from '../../services/mentor/mentorJobService.js';
import { catchAsync } from '../../utils/errors/catchAsync.js';

export const mentorJobController = {
  /**
   * @desc    Get available jobs for mentors
   * @route   GET /api/mentors/jobs/available
   * @access  Private/Mentor
   */
  getAvailableJobs: catchAsync(async (req, res) => {
    const jobs = await MentorJobService.getAvailableJobs(req.query, req.user.id);
    
    res.status(200).json({
      success: true,
      data: jobs.jobs,
      pagination: jobs.pagination,
      filters: jobs.filters
    });
  }),

  /**
   * @desc    Get job by ID
   * @route   GET /api/mentors/jobs/:id
   * @access  Private/Mentor
   */
  getJobById: catchAsync(async (req, res) => {
    const job = await MentorJobService.getJobById(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      data: job
    });
  }),

  /**
   * @desc    Get recommended jobs for mentor
   * @route   GET /api/mentors/jobs/recommended
   * @access  Private/Mentor
   */
  getRecommendedJobs: catchAsync(async (req, res) => {
    const jobs = await MentorJobService.getRecommendedJobs(req.user.id, req.query);
    
    res.status(200).json({
      success: true,
      data: jobs
    });
  }),

  /**
   * @desc    Search jobs by keywords and filters
   * @route   GET /api/mentors/jobs/search
   * @access  Private/Mentor
   */
  searchJobs: catchAsync(async (req, res) => {
    const jobs = await MentorJobService.searchJobs(req.query, req.user.id);
    
    res.status(200).json({
      success: true,
      data: jobs.jobs,
      pagination: jobs.pagination,
      searchMeta: jobs.searchMeta
    });
  }),

  /**
   * @desc    Save job for later
   * @route   POST /api/mentors/jobs/:id/save
   * @access  Private/Mentor
   */
  saveJob: catchAsync(async (req, res) => {
    await MentorJobService.saveJob(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Job saved successfully'
    });
  }),

  /**
   * @desc    Get saved jobs
   * @route   GET /api/mentors/jobs/saved
   * @access  Private/Mentor
   */
  getSavedJobs: catchAsync(async (req, res) => {
    const jobs = await MentorJobService.getSavedJobs(req.user.id, req.query);
    
    res.status(200).json({
      success: true,
      data: jobs.jobs,
      pagination: jobs.pagination
    });
  }),

  /**
   * @desc    Remove saved job
   * @route   DELETE /api/mentors/jobs/:id/save
   * @access  Private/Mentor
   */
  removeSavedJob: catchAsync(async (req, res) => {
    await MentorJobService.removeSavedJob(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Job removed from saved list'
    });
  })
};