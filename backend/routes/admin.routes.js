import express from 'express';
import { authenticate } from '../middleware/auth/authenticate.js';
import { restrictTo } from '../middleware/authorization/roles.js';
import { ROLES } from '../config/constants.js';
console.log('[debug] admin.routes.js loaded');

// Import admin controllers
import { adminJobController } from '../controllers/admin/adminJobController.js';
import { adminApplicationController } from '../controllers/admin/adminApplicationController.js';
import { adminUserController } from '../controllers/admin/adminUserController.js';
import { adminAnalyticsController } from '../controllers/admin/adminAnalyticsController.js';

const router = express.Router();

// 🔐 ALL ADMIN ROUTES REQUIRE AUTHENTICATION + ADMIN ROLE
router.use(authenticate);
router.use(restrictTo(ROLES.ADMIN));

// ========================
// 📊 ANALYTICS & DASHBOARD
// ========================
router.get('/dashboard/overview', adminAnalyticsController.getDashboardOverview);
router.get('/stats/platform', adminUserController.getPlatformStats);
router.get('/stats/jobs', adminJobController.getJobStats);
router.get('/stats/applications', adminApplicationController.getApplicationStats);

// ========================
// 👥 USER MANAGEMENT
// ========================
router.get('/users', adminUserController.getUsers); // GET /api/admin/users?role=mentor&status=active
router.get('/users/:id', adminUserController.getUser); // GET /api/admin/users/:id
router.patch('/users/:id/status', adminUserController.updateUserStatus); // PATCH /api/admin/users/:id/status
router.delete('/users/:id', adminUserController.deleteUser); // DELETE /api/admin/users/:id
router.get('/users/:id/profile', adminUserController.getUserProfile); // GET /api/admin/users/:id/profile

// ========================
// 📋 JOB MANAGEMENT
// ========================
router.get('/jobs', adminJobController.getJobs); // GET /api/admin/jobs?status=pending_approval
router.get('/jobs/pending', adminJobController.getPendingJobs); // GET /api/admin/jobs/pending
router.get('/jobs/:id', adminJobController.getJob); // GET /api/admin/jobs/:id
router.put('/jobs/:id/approve', adminJobController.approveJob); // PUT /api/admin/jobs/:id/approve
router.put('/jobs/:id/reject', adminJobController.rejectJob); // PUT /api/admin/jobs/:id/reject
router.patch('/jobs/:id/priority', adminJobController.updateJobPriority); // PATCH /api/admin/jobs/:id/priority
router.get('/jobs/:id/applications', adminJobController.getJobApplications); // GET /api/admin/jobs/:id/applications

// ========================
// 📝 APPLICATION VETTING
// ========================
router.get('/applications', adminApplicationController.getApplications); // GET /api/admin/applications?status=pending_vetting
router.get('/applications/pending', adminApplicationController.getPendingApplications); // GET /api/admin/applications/pending
router.get('/applications/:id', adminApplicationController.getApplication); // GET /api/admin/applications/:id
router.put('/applications/:id/vet', adminApplicationController.vetApplication); // PUT /api/admin/applications/:id/vet
router.get('/applications/job/:jobId', adminApplicationController.getJobApplications); // GET /api/admin/applications/job/:jobId

// ========================
// 📈 REPORTS & INSIGHTS
// ========================
router.get('/reports/registration-trends', adminAnalyticsController.getRegistrationTrends);
router.get('/reports/mentor-performance', adminAnalyticsController.getMentorPerformance);
router.get('/reports/platform-growth', adminAnalyticsController.getPlatformGrowth);

export default router;