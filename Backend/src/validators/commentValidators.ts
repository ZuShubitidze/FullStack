import { z } from "zod";

export const createCommentSchema = z.object({
  comment: z.string().trim().min(2, "Must be at least 2 characters"),
  postId: z.number(),
  parentId: z.number(),
});

export const updateCommentSchema = z.object({
  comment: z.string().trim().min(2, "Comment must be at least 2 characters"),
  id: z.number(),
});

export type createCommentInput = z.infer<typeof createCommentSchema>;
export type updateCommentInput = z.infer<typeof updateCommentSchema>;
