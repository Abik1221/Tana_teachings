import express from 'express';
import { authenticate } from '../middleware/auth/authenticate.js';
import { restrictTo } from '../middleware/authorization/roles.js';
import { ROLES } from '../config/constants.js';
import familyProfileController from '../controllers/family/familyProfileController.js';
import familyStudentController from '../controllers/family/familyStudentController.js';
import { validate } from '../middleware/validation/validate.js';
import { createFamilySchema, updateFamilySchema } from '../middleware/validation/familyValidation.js';
import { createStudentSchema, updateStudentSchema } from '../middleware/validation/studentValidation.js';

const router = express.Router();

// 🔐 ALL FAMILY ROUTES REQUIRE AUTHENTICATION + FAMILY ROLE
router.use(authenticate);
router.use(restrictTo(ROLES.FAMILY));

// ========================
// 👨‍👩‍👧‍👦 FAMILY PROFILE MANAGEMENT
// ========================
router.get('/profile', familyProfileController.getProfile);
router.post('/profile', validate(createFamilySchema), familyProfileController.createOrUpdateProfile);
router.patch('/profile/contact', validate(updateFamilySchema), familyProfileController.updateContactInfo);
router.patch('/profile/address', validate(updateFamilySchema), familyProfileController.updateAddress);
router.patch('/profile/emergency-contact', validate(updateFamilySchema), familyProfileController.updateEmergencyContact);
router.get('/stats', familyProfileController.getStats);

// ========================
// 🧒 FAMILY STUDENT MANAGEMENT
// ========================
router.get('/students', familyStudentController.getStudents);
router.post('/students', validate(createStudentSchema), familyStudentController.addStudent);

router.get('/students/:id', familyStudentController.getStudentById);
router.patch('/students/:id', validate(updateStudentSchema), familyStudentController.updateStudent);
router.delete('/students/:id', familyStudentController.deleteStudent);
router.get('/students/:id/stats', familyStudentController.getStudentStats);

export default router;
