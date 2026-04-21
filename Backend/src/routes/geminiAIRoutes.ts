import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { chat, getAIRequests } from "../controllers/geminiAIcontroller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/chat", protect, asyncHandler(chat));
router.get("/getAIRequests", protect, asyncHandler(getAIRequests));

export default router;
