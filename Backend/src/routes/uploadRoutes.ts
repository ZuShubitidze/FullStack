import express from "express";
import { getSignature } from "../controllers/uploadController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/sign-upload", asyncHandler(getSignature));

export default router;
