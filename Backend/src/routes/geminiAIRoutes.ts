import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { chat, getAIRequests } from "../controllers/geminiAIcontroller.js";
import { protect } from "../middleware/protect.js";
import multer from "multer";

const upload = multer();

const router = express.Router();

router.post("/chat", protect, upload.single("image"), asyncHandler(chat));
router.get("/getAIRequests", protect, asyncHandler(getAIRequests));

export default router;
