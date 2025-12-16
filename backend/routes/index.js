import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import familyRoutes from './family.routes.js';
// import studentRoutes from './student.routes.js';
import mentorRoutes from './mentor.routes.js';
import adminRoutes from './admin.routes.js';

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
// router.use('/student', studentRoutes);
router.use('/mentors', mentorRoutes);
router.use('/admin', adminRoutes);

export default router;