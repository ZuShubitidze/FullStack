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
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

// Rate Limiter
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10, // Only 10 attempts per hour
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      status: "Error",
      message: options.message,
      error: "AUTH_LIMIT_REACHED",
    });
  },
  message: "Too many login/register attempts. Please try again in an hour.",
});

router.put(
  "/update-profile",
  validate(UpdateProfileSchema),
  asyncHandler(updateProfile),
);
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  asyncHandler(register),
);
router.post("/login", authLimiter, validate(loginSchema), asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.get("/me", protect, asyncHandler(getMe));
router.get("/refresh", asyncHandler(refresh));

export default router;
