import { AdminJobService } from '../../services/admin/adminJobService.js';
import  {catchAsync} from '../../utils/errors/catchAsync.js';

export const adminJobController = {
  /**
   * @desc    List jobs with admin filters
   * @route   GET /api/admin/jobs
   * @access  Private/Admin
   */
  getJobs: catchAsync(async (req, res) => {
    const result = await AdminJobService.getJobs(req.query);

    res.status(200).json({
      success: true,
      data: result.jobs,
      pagination: result.pagination
    });
  }),

  /**
   * @desc    Get pending jobs for admin
   * @route   GET /api/admin/jobs/pending
   * @access  Private/Admin
   */
  getPendingJobs: catchAsync(async (req, res) => {
    const result = await AdminJobService.getPendingJobs(req.query);

    res.status(200).json({
      success: true,
      data: result.jobs,
      pagination: result.pagination
    });
  }),

  /**
   * @desc    Get single job by ID
   * @route   GET /api/admin/jobs/:id
   * @access  Private/Admin
   */
  getJob: catchAsync(async (req, res) => {
    const { id } = req.params;

    const job = await AdminJobService.getJobById(id);

    res.status(200).json({
      success: true,
      data: job
    });
  }),

  /**
   * @desc    Approve a job
   * @route   PUT /api/admin/jobs/:id/approve
   * @access  Private/Admin
   */
  approveJob: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { notes = '' } = req.body;

    const job = await AdminJobService.approveJob(id, req.user.id, notes);

    res.status(200).json({
      success: true,
      message: 'Job approved',
      data: job
    });
  }),

  /**
   * @desc    Reject a job
   * @route   PUT /api/admin/jobs/:id/reject
   * @access  Private/Admin
   */
  rejectJob: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { rejectionReason, notes = '' } = req.body;

    const job = await AdminJobService.rejectJob(id, req.user.id, rejectionReason, notes);

    res.status(200).json({
      success: true,
      message: 'Job rejected',
      data: job
    });
  }),

  /**
   * @desc    Update job priority
   * @route   PATCH /api/admin/jobs/:id/priority
   * @access  Private/Admin
   */
  updateJobPriority: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { priority } = req.body;

    const job = await AdminJobService.updateJobPriority(id, priority);

    res.status(200).json({
      success: true,
      data: job
    });
  }),

  /**
   * @desc    Get applications for a specific job
   * @route   GET /api/admin/jobs/:id/applications
   * @access  Private/Admin
   */
  getJobApplications: catchAsync(async (req, res) => {
    const { id } = req.params;

    const applications = await AdminJobService.getJobApplications(id);

    res.status(200).json({
      success: true,
      data: applications
    });
  })
  ,

  /**
   * @desc    Get job statistics for admin dashboard
   * @route   GET /api/admin/stats/jobs
   * @access  Private/Admin
   */
  getJobStats: catchAsync(async (req, res) => {
    const { timeframe = '30d' } = req.query;

    const stats = await AdminJobService.getJobStats(timeframe);

    res.status(200).json({ success: true, data: stats });
  })
};