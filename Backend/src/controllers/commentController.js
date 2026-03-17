import { io } from "../server.js";
import { prisma } from "../lib/prisma.js";

// Create Comment
const createComment = async (req, res) => {
  try {
    const { comment, authorId, postId, parentId } = req.body;
    // Not enough data from frontend
    if (!comment || !authorId || !postId) {
      return res.status(400).json({
        error: "Mising required data",
      });
    }

    console.log(authorId);

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
    console.log(postOwnerId, newComment.post, newComment.post.authorId);
    const parentAuthorId = newComment.parent?.author.id;
    const currentUserId = Number(authorId);

    // Notify post owner unless they are owner of the post
    if (postOwnerId !== currentUserId) {
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
      io.to(parentAuthorId.toString()).emit("new_notification", {
        type: "REPLY",
        message: `${newComment.author.name} replied to your comment!`,
        from: currentUserId,
        postId: postId,
      });
    }

    res.status(201).json({ status: "success", data: newComment });
  } catch (error) {
    console.log("Error occured while creating comment:", error);
    res.status(404).json({ error: "Error creating comment" });
  }
};

// Update Comment
const updateComment = async (req, res) => {
  try {
    const { comment, id } = req.body;

    const updatedComment = await prisma.comment.update({
      where: {
        id: Number(id),
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
  } catch (error) {
    console.log("Error updating comment", error);
    res.status(404).json({ error: "Failed to update comment" });
  }
};

export { createComment, updateComment };
