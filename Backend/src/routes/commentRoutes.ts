import express from "express";
import {
  createComment,
  updateComment,
} from "../controllers/commentController.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "src/validators/commentValidators.js";
import { validate } from "src/middleware/validate.js";
import { asyncHandler } from "src/middleware/asyncHandler.js";

const router = express.Router();

router.post("/", validate(createCommentSchema), asyncHandler(createComment));
router.put("/", validate(updateCommentSchema), asyncHandler(updateComment));

export default router;
