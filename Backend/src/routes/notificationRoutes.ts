import express from "express";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notificationsController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/mark-all-read", protect, markAllAsRead);
router.put("/mark-as-read", protect, markAsRead);

export default router;
