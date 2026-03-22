import express from "express";
import {
  createPost,
  deletePost,
  fetchPost,
  fetchPosts,
  getInfinitePosts,
  updatePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/protect.js";
import {
  validate,
  validateParams,
  validateQuery,
} from "src/middleware/validate.js";
import {
  createPostSchema,
  deletePostSchema,
  fetchPostSchema,
  getInfinitePostsSchema,
  updatePostSchema,
} from "src/validators/postValidators.js";
import { asyncHandler } from "src/middleware/asyncHandler.js";

const router = express.Router();

router.get("/", fetchPosts);
router.get(
  "/infinite",
  validateQuery(getInfinitePostsSchema),
  getInfinitePosts,
);
router.post(
  "/createPost",
  validate(createPostSchema),
  protect,
  asyncHandler(createPost),
);
router.delete(
  "/:id",
  validateParams(deletePostSchema),
  protect,
  asyncHandler(deletePost),
);
router.get("/:id", validateParams(fetchPostSchema), asyncHandler(fetchPost));
router.put(
  "/:id",
  validate(updatePostSchema),
  protect,
  asyncHandler(updatePost),
);

export default router;
