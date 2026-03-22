import express from "express";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notificationsController.js";
import { protect } from "../middleware/protect.js";
import { validate } from "../middleware/validate.js";
import { markAsReadSchema } from "../validators/notificationsValidators.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", protect, asyncHandler(getNotifications));
router.put("/mark-all-read", protect, asyncHandler(markAllAsRead));
router.put(
  "/mark-as-read",
  validate(markAsReadSchema),
  protect,
  asyncHandler(markAsRead),
);

export default router;
