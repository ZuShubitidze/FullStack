import { io } from "../app.js";
import prisma from "../lib/prisma.js";
import type { Request, Response } from "express";

// Create Comment
const createComment = async (req: Request, res: Response) => {
  const { comment, postId, parentId } = req.body;

  const authorId = req.user.id;

  // Success
  const newComment = await prisma.comment.create({
    data: {
      comment,
      authorId: Number(authorId),
      postId: Number(postId),
      parentId: parentId && Number(parentId) !== 0 ? Number(parentId) : null,
    },
    // Take name
    include: {
      author: { select: { name: true } },
      // Need Post and Parent for Socket
      post: {
        select: {
          authorId: true,
          title: true,
        },
      },
      parent: {
        include: {
          author: { select: { id: true } },
        },
      },
    },
  });

  // Indentify Post Owner
  const postOwnerId = newComment.post.authorId;
  const parentAuthorId = newComment.parent?.author.id;
  const currentUserId = Number(authorId);

  // Notify post owner unless they are owner of the post
  if (postOwnerId !== currentUserId) {
    // Save to Post owner's Database for history
    await prisma.notification.create({
      data: {
        userId: postOwnerId,
        type: "COMMENT",
        message: `${newComment.author.name} commented on: ${newComment.post.title}`,
        postId: postId,
      },
    });
    // Emit via Socket for real-time
    io.to(postOwnerId.toString()).emit("new_notification", {
      type: "COMMENT",
      message: `New comment on your post: "${newComment.post.title}"`,
      from: currentUserId,
      postId: postId,
    });
  }
  // Notify parent comment auhor for replies
  if (
    parentAuthorId &&
    parentAuthorId !== currentUserId &&
    parentAuthorId !== postOwnerId
  ) {
    // Save to User's Database for history
    await prisma.notification.create({
      data: {
        userId: postOwnerId,
        type: "REPLY",
        message: `${newComment.author.name} commented on: ${newComment.post.title}`,
        postId: postId,
      },
    });
    // Emit via Socket for real-time
    io.to(parentAuthorId.toString()).emit("new_notification", {
      type: "REPLY",
      message: `${newComment.author.name} replied to your comment!`,
      from: currentUserId,
      postId: postId,
    });
  }

  res.status(201).json({ status: "success", data: newComment });
};

// Update Comment
const updateComment = async (req: Request, res: Response) => {
  const { comment, id } = req.body;
  const authorId = req.user.id;

  const updatedComment = await prisma.comment.update({
    where: {
      id: Number(id),
      authorId: authorId,
    },
    // Data we are changing
    data: {
      comment,
    },
  });

  res.status(200).json({
    status: "success",
    data: { comment: updatedComment },
  });
};

export { createComment, updateComment };
