import { AdminApplicationService } from '../../services/admin/adminApplicationService.js';
import  catchAsync  from '../../utils/errors/catchAsync.js';

export const adminApplicationController = {
  /**
   * @desc    Get all applications with filtering
   * @route   GET /api/admin/applications
   * @access  Private/Admin
   */
  getApplications: catchAsync(async (req, res) => {
    const result = await AdminApplicationService.getApplications(req.query);
    
    res.status(200).json({
      success: true,
      data: result.applications,
      pagination: result.pagination
    });
  }),

  /**
   * @desc    Get pending applications for vetting
   * @route   GET /api/admin/applications/pending
   * @access  Private/Admin
   */
  getPendingApplications: catchAsync(async (req, res) => {
    const result = await AdminApplicationService.getPendingApplications(req.query);
    
    res.status(200).json({
      success: true,
      data: result.applications,
      pagination: result.pagination
    });
  }),

  /**
   * @desc    Get single application
   * @route   GET /api/admin/applications/:id
   * @access  Private/Admin
   */
  getApplication: catchAsync(async (req, res) => {
    const { id } = req.params;

    const application = await AdminApplicationService.getApplicationById(id);

    res.status(200).json({ success: true, data: application });
  }),

  /**
   * @desc    Vet application (shortlist or reject)
   * @route   PUT /api/admin/applications/:id/vet
   * @access  Private/Admin
   */
  vetApplication: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { action, vettingNotes } = req.body;
    
    const application = await AdminApplicationService.vetApplication(
      id, 
      req.user.id, 
      action, 
      vettingNotes
    );
    
    res.status(200).json({
      success: true,
      message: `Application ${action}ed successfully`,
      data: application
    });
  }),

  /**
   * @desc    Get application statistics
   * @route   GET /api/admin/applications/stats
   * @access  Private/Admin
   */
  getApplicationStats: catchAsync(async (req, res) => {
    const { timeframe } = req.query;
    
    const stats = await AdminApplicationService.getApplicationStats(timeframe);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  })
  ,

  /**
   * @desc    Get applications for a specific job
   * @route   GET /api/admin/applications/job/:jobId
   * @access  Private/Admin
   */
  getJobApplications: catchAsync(async (req, res) => {
    const { jobId } = req.params;

    const applications = await AdminApplicationService.getApplicationsByJobId(jobId);

    res.status(200).json({ success: true, data: applications });
  })
};