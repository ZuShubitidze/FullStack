import express from "express";
import {
  createComment,
  updateComment,
} from "../controllers/commentController.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/commentValidators.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/", validate(createCommentSchema), asyncHandler(createComment));
router.put("/", validate(updateCommentSchema), asyncHandler(updateComment));

export default router;
