import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  authorId: z.number(),
  imageUrl: z.string().optional(),
});

export const getInfinitePostsSchema = z.object({
  // Use coerce to handle "10" -> 10
  cursor: z.coerce.number().optional().default(0),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().trim().default(""),
});

export const updatePostSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters").optional(),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .optional(),
  published: z.boolean().default(false),
  imageUrl: z.string().optional(),
});

export const fetchPostSchema = z.object({
  id: z.coerce.number(),
});

export const deletePostSchema = z.object({
  id: z.coerce.number(),
});

export type createPostInput = z.infer<typeof createPostSchema>;
export type updatePostInput = z.infer<typeof updatePostSchema>;
