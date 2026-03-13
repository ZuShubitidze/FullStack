import express from "express";
import {
  createPost,
  deletePost,
  fetchPost,
  fetchPosts,
  getInfinitePosts,
  updatePost,
} from "../controllers/postController";
import { protect } from "../middleware/protect";

const router = express.Router();

router.get("/", fetchPosts);
router.get("/infinite", getInfinitePosts);
router.post("/createPost", createPost);
router.delete("/:id", protect, deletePost);
router.get("/:id", fetchPost);
router.put("/:id", updatePost);

export default router;
