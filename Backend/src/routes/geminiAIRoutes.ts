import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  generateResponse,
  getAIRequests,
} from "../controllers/geminiAIcontroller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/generateResponse", protect, asyncHandler(generateResponse));
router.get("/getAIRequests", protect, asyncHandler(getAIRequests));

export default router;
