import { MentorApplicationService } from '../../services/mentor/mentorApplicationService.js';
import { catchAsync } from '../../utils/errors/catchAsync.js';

export const mentorApplicationController = {
  /**
   * @desc    Apply to a job
   * @route   POST /api/mentors/applications
   * @access  Private/Mentor
   */
  applyToJob: catchAsync(async (req, res) => {
    const applicationData = {
      ...req.body,
      mentorId: req.user.id
    };

    const application = await MentorApplicationService.applyToJob(applicationData);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  }),

  /**
   * @desc    Get mentor's applications
   * @route   GET /api/mentors/applications
   * @access  Private/Mentor
   */
  getMyApplications: catchAsync(async (req, res) => {
    const applications = await MentorApplicationService.getMentorApplications(req.user.id, req.query);
    
    res.status(200).json({
      success: true,
      data: applications.applications,
      pagination: applications.pagination,
      stats: applications.stats
    });
  }),

  /**
   * @desc    Get application by ID
   * @route   GET /api/mentors/applications/:id
   * @access  Private/Mentor
   */
  getApplicationById: catchAsync(async (req, res) => {
    const application = await MentorApplicationService.getApplicationById(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      data: application
    });
  }),

  /**
   * @desc    Update application
   * @route   PATCH /api/mentors/applications/:id
   * @access  Private/Mentor
   */
  updateApplication: catchAsync(async (req, res) => {
    const application = await MentorApplicationService.updateApplication(
      req.params.id, 
      req.user.id, 
      req.body
    );
    
    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });
  }),

  /**
   * @desc    Withdraw application
   * @route   DELETE /api/mentors/applications/:id
   * @access  Private/Mentor
   */
  withdrawApplication: catchAsync(async (req, res) => {
    await MentorApplicationService.withdrawApplication(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  }),

  /**
   * @desc    Get application statistics
   * @route   GET /api/mentors/applications/stats
   * @access  Private/Mentor
   */
  getApplicationStats: catchAsync(async (req, res) => {
    const stats = await MentorApplicationService.getApplicationStats(req.user.id);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  }),

  /**
   * @desc    Check if already applied to job
   * @route   GET /api/mentors/applications/check/:jobId
   * @access  Private/Mentor
   */
  checkApplication: catchAsync(async (req, res) => {
    const hasApplied = await MentorApplicationService.checkIfApplied(req.params.jobId, req.user.id);
    
    res.status(200).json({
      success: true,
      data: { hasApplied }
    });
  })
};