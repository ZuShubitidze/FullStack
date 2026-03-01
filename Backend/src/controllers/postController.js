import { prisma } from "../lib/prisma";
// Create
const createPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    // Basic Validation
    if (!title || !content || !authorId) {
      return res
        .status(400)
        .json({ error: "Please provide title, content, and authorId" });
    }

    // Success
    const post = await prisma.post.create({
      data: {
        title: title,
        content: content,
        // Saves time finding unique user
        author: {
          connect: { id: authorId },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    // Prisma throws specific error codes if 'connect' fails
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch Posts
const fetchPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            // Ensure we don't leak hashed password to frontend
            id: true,
            name: true,
            email: true,
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
  } catch (error) {
    console.log("Full Prisma Error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Update
const updatePost = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL
    const { title, content, published } = req.body;

    const updatedPost = await prisma.post.update({
      where: {
        id: Number(id), // Convert URL ID to number
      },
      data: {
        title,
        content,
        published,
      },
    });

    res.status(200).json({
      status: "success",
      data: { post: updatedPost },
    });
  } catch (error) {
    console.log("--- ERROR DETECTED ---");
    console.error("Message:", error.message);
    console.error("Prisma Code:", error.code);
    // Record to update not found code
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Fetch Post
const fetchPost = async (req, res) => {
  try {
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
  } catch (error) {
    console.log("Prisma Error:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

export { createPost, fetchPosts, updatePost, fetchPost };
