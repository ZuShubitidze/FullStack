import express from "express";
import {
  getMe,
  login,
  logout,
  refresh,
  register,
} from "../controllers/authControllers.js";
import { validate } from "../middleware/validate.js";
import { registerSchema } from "../validators/authValidators.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.get("/refresh", refresh);

export default router;
