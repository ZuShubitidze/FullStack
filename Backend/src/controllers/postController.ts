import type {
  createPostInput,
  updatePostInput,
} from "src/validators/postValidators.js";
import { prisma } from "../lib/prisma.js";
import type { Request, Response } from "express";

// Create
const createPost = async (req: Request, res: Response) => {
  const { title, content, imageUrl }: createPostInput = req.body;
  const authorId = req.user.id;

  // Success
  const post = await prisma.post.create({
    data: {
      title: title,
      content: content,
      // Saves time finding unique user
      author: {
        connect: { id: authorId },
      },
      Image: imageUrl ?? null,
    },
  });

  res.status(201).json(post);
};

// Fetch All Posts
const fetchPosts = async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          // Ensure we don't leak hashed password to frontend
          id: true,
          name: true,
          email: true,
          Image: true,
        },
      },
    },
    orderBy: {
      // Newest posts first
      createdAt: "desc",
    },
  });
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: { posts },
  });
};

// Infinite Posts
const getInfinitePosts = async (req: Request, res: Response) => {
  const { cursor, limit = 10, search = "" } = req.query; // Search Params

  // Search
  let where = {};
  if (search && typeof search === "string" && search.trim() !== "") {
    where = {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const posts = await prisma.post.findMany({
    take: Number(limit),
    ...(cursor
      ? {
          skip: 1, // Skip the cursor / last post if it exists
          cursor: { id: Number(cursor) },
        }
      : {}),
    where,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, Image: true } } }, // Get Author Name with Post
  });

  const nextCursor =
    posts.length === Number(limit) ? posts[posts.length - 1]?.id : null;

  res.json({ posts, nextCursor });
};

// Update
const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params; // Get ID from URL
  // const { title, content, published, imageUrl }: updatePostInput = req.body;
  const { imageUrl, title, content, ...restOfData } = req.body;
  const userId = req.user.id;

  const updatedPost = await prisma.post.update({
    where: {
      id: Number(id), // Convert URL ID to number
      authorId: userId,
    },
    data: {
      ...restOfData,
      ...(imageUrl !== undefined && { Image: imageUrl }),
    },
  });

  res.status(200).json({
    status: "success",
    data: { post: updatedPost },
  });
};

// Fetch Post
const fetchPost = async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      author: {
        select: {
          // Ensure we don't leak hashed password to frontend
          id: true,
          name: true,
          email: true,
          Image: true,
        },
      },
      comments: {
        where: { parentId: null }, // Only get top-level comments
        include: {
          // Get comment author
          author: {
            select: {
              name: true,
            },
          },
          // Nested replies
          replies: {
            include: {
              author: { select: { name: true } },
              replies: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: { post },
  });
};

// Delete Post
const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const post = await prisma.post.findUnique({
    where: { id: Number(id), authorId: userId },
  });

  if (!post) return res.status(404).json({ message: "Post not found" });

  // Success
  await prisma.post.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: `Deteled post ${post}` });
};

export {
  createPost,
  fetchPosts,
  updatePost,
  fetchPost,
  getInfinitePosts,
  deletePost,
};
