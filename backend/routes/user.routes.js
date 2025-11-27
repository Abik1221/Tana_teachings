import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth/authenticate.js";

const router = Router();

router.use(authenticate);

// Generic User Profile updates (Common fields like Name, Phone, Avatar)
// Role-specific updates happen in family.routes.js or mentor.routes.js
router.put("/profile", AuthController.updateProfile);

export default router;