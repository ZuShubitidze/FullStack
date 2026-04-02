import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { generateResponse } from "../controllers/geminiAIcontroller.js";

const router = express.Router();

router.post("/generateResponse", asyncHandler(generateResponse));

export default router;
