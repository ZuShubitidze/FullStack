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

const router = express.Router();

router.post("/", validate(createCommentSchema), createComment);
router.put("/", validate(updateCommentSchema), updateComment);

export default router;
