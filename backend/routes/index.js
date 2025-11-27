import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import familyRoutes from './family.routes.js';
import studentRoutes from './student.routes.js';
import mentorRoutes from './mentor.routes.js';
import adminRoutes from './admin.routes.js'; 

// Future Modules - Uncomment as we build them
// import jobRoutes from './job.routes.js';
// import applicationRoutes from './application.routes.js';
// import sessionRoutes from './session.routes.js';
// import progressRoutes from './progress.routes.js';
// import paymentRoutes from './payment.routes.js';

const router = express.Router();

// Health check - Vital for load balancers (AWS/GCP)
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mentorship Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/families', familyRoutes);
router.use('/students', studentRoutes);
router.use('/mentors', mentorRoutes);
router.use('/admin', adminRoutes); // ADD THIS LINE

// Future Mounts
// router.use('/jobs', jobRoutes);
// router.use('/applications', applicationRoutes);
// router.use('/sessions', sessionRoutes);
// router.use('/progress', progressRoutes);
// router.use('/payments', paymentRoutes);

export default router;