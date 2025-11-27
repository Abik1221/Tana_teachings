import Application from '../../models/Application.js';
import Job from '../../models/Job.js';
import AppError from '../../utils/errors/AppError.js';

export class AdminApplicationService {
  static async getApplications(query = {}) {
    const {
      status,
      applicant,
      jobId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = query;

    const filter = {};
    if (status) filter.status = status;
    if (applicant) filter.student = applicant;
    if (jobId) filter.job = jobId;

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const applications = await Application.find(filter)
      .populate('student', 'name email gradeLevel')
      .populate('job', 'title family')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    return {
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getPendingApplications(query = {}) {
    return this.getApplications({ ...query, status: 'pending_vetting' });
  }

  static async getApplicationById(id) {
    const application = await Application.findById(id)
      .populate('student', 'name email gradeLevel')
      .populate('job', 'title family');

    if (!application) throw new AppError('Application not found', 404);

    return application;
  }

  static async getApplicationsByJobId(jobId) {
    const applications = await Application.find({ job: jobId })
      .populate('student', 'name email gradeLevel')
      .populate('job', 'title family');

    return applications;
  }

  static async vetApplication(applicationId, adminId, action, vettingNotes = '') {
    const application = await Application.findById(applicationId);

    if (!application) throw new AppError('Application not found', 404);

    // normalize action
    const act = (action || '').toLowerCase();

    if (!['shortlist', 'reject', 'approve'].includes(act)) {
      throw new AppError('Invalid vetting action', 400);
    }

    application.status = act === 'shortlist' ? 'shortlisted' : act === 'reject' ? 'rejected' : 'approved';
    application.vetting = application.vetting || [];
    application.vetting.push({
      admin: adminId,
      action: act,
      notes: vettingNotes,
      at: new Date()
    });

    await application.save();

    return await Application.findById(applicationId)
      .populate('student', 'name email gradeLevel')
      .populate('job', 'title family');
  }

  static async getApplicationStats(timeframe = '30d') {
    const now = new Date();
    let startDate = new Date(now.setDate(now.getDate() - 30));
    if (timeframe === '7d') startDate = new Date(now.setDate(now.getDate() - 7));
    if (timeframe === '90d') startDate = new Date(now.setDate(now.getDate() - 90));

    const dateFilter = { createdAt: { $gte: startDate } };

    const stats = await Application.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);

    const total = await Application.countDocuments(dateFilter);

    return { total, statusBreakdown: stats, timeframe };
  }
}

export default AdminApplicationService;
