import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth/authenticate.js';
import { authLimiter } from '../middleware/security/rateLimiting.js';
import { 
  validateRegistration, 
  validateLogin 
} from '../middleware/validation/authValidation.js';

const router = express.Router();

// Public routes with Rate Limiting
router.post('/register', authLimiter, validateRegistration, AuthController.register);
router.post('/login', authLimiter, validateLogin, AuthController.login);

// Future: Password Reset Flow
// router.post('/forgot-password', validateForgotPassword, AuthController.forgotPassword);
// router.post('/reset-password', validateResetPassword, AuthController.resetPassword);

// Protected routes
router.use(authenticate); // All routes below require valid JWT

router.post('/logout', AuthController.logout);
router.get('/me', AuthController.getMe);
// router.put('/change-password', validateChangePassword, AuthController.changePassword);

export default router;