import express from "express";
import {
  createPost,
  fetchPost,
  fetchPosts,
  getInfinitePosts,
  updatePost,
} from "../controllers/postController";

const router = express.Router();

router.get("/", fetchPosts);
router.get("/infinite", getInfinitePosts);
router.post("/createPost", createPost);
router.get("/:id", fetchPost);
router.put("/:id", updatePost);

export default router;
