import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { 
  validateRegistration, 
  validateLogin,
  validateFamilyProfile,
  validateStudentProfile, 
  validateMentorProfile 
} from '../middleware/validation/authValidation.js';
import { authenticate } from '../middleware/auth/authenticate.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);

// Protected routes (require authentication)
router.use(authenticate);

// Profile completion routes (after login)
router.post('/profile/family', validateFamilyProfile, AuthController.createProfile);
router.post('/profile/student', validateStudentProfile, AuthController.createProfile);
router.post('/profile/mentor', validateMentorProfile, AuthController.createProfile);

// Common profile updates
router.put('/profile', AuthController.updateProfile);
router.get('/me', AuthController.getMe);
router.post('/logout', AuthController.logout);

export default router;