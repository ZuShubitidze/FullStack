import express from "express";
import {
  createPost,
  fetchPost,
  fetchPosts,
  updatePost,
} from "../controllers/postController";

const router = express.Router();

router.post("/createPost", createPost);
router.get("/", fetchPosts);
router.get("/:id", fetchPost);
router.put("/:id", updatePost);

export default router;
