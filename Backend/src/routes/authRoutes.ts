import express from "express";
import {
  getMe,
  login,
  logout,
  refresh,
  register,
  updateProfile,
} from "../controllers/authControllers.js";
import { validate } from "../middleware/validate.js";
import {
  loginSchema,
  registerSchema,
  UpdateProfileSchema,
} from "../validators/authValidators.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.put("/update-profile", validate(UpdateProfileSchema), updateProfile);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.get("/refresh", refresh);

export default router;
