import express from 'express';
import { authenticate } from '../middleware/auth/authenticate.js';
import { restrictTo } from '../middleware/authorization/roles.js';
import { ROLES } from '../config/constants.js';
import { mentorProfileController } from '../controllers/mentor/mentorProfileController.js';
import { mentorJobController } from '../controllers/mentor/mentorJobController.js';
import { mentorApplicationController } from '../controllers/mentor/mentorApplicationController.js';

const router = express.Router();

// 🔐 ALL MENTOR ROUTES REQUIRE AUTHENTICATION + MENTOR ROLE
router.use(authenticate);
router.use(restrictTo(ROLES.MENTOR));

// ========================
// 👨‍🏫 PROFILE MANAGEMENT
// ========================
router.route('/profile')
  .get(mentorProfileController.getProfile)
  .put(mentorProfileController.createOrUpdateProfile);

router.patch('/profile/availability', mentorProfileController.updateAvailability);
router.patch('/profile/subjects', mentorProfileController.updateSubjects);
router.patch('/profile/hourly-rate', mentorProfileController.updateHourlyRate);
router.patch('/profile/visibility', mentorProfileController.updateVisibility);
router.get('/profile/stats', mentorProfileController.getStats);
router.post('/profile/qualifications/documents', mentorProfileController.uploadQualificationDocument);

// ========================
// 📋 JOB DISCOVERY
// ========================
router.get('/jobs/available', mentorJobController.getAvailableJobs);
router.get('/jobs/recommended', mentorJobController.getRecommendedJobs);
router.get('/jobs/search', mentorJobController.searchJobs);
router.get('/jobs/:id', mentorJobController.getJobById);
router.post('/jobs/:id/save', mentorJobController.saveJob);
router.get('/jobs/saved', mentorJobController.getSavedJobs);
router.delete('/jobs/:id/save', mentorJobController.removeSavedJob);

// ========================
// 📝 APPLICATION MANAGEMENT
// ========================
router.route('/applications')
  .get(mentorApplicationController.getMyApplications)
  .post(mentorApplicationController.applyToJob);

router.route('/applications/:id')
  .get(mentorApplicationController.getApplicationById)
  .patch(mentorApplicationController.updateApplication)
  .delete(mentorApplicationController.withdrawApplication);

router.get('/applications/stats', mentorApplicationController.getApplicationStats);
router.get('/applications/check/:jobId', mentorApplicationController.checkApplication);

export default router;
