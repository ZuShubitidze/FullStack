import express from "express";
import { createComment, updateComment } from "../controllers/commentController";

const router = express.Router();

router.post("/", createComment);
router.put("/", updateComment);

export default router;
