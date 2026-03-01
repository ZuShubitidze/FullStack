import { prisma } from "../lib/prisma";

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
      },
    });
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
