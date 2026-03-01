import axios from "axios";

export const putPost = async (id: string, title: string, content: string) => {
  try {
    const res = await axios.put(`http://localhost:3000/posts/${id}`, {
      title,
      content,
    });
    console.log("Updated at:", res.data.data.post.updatedAt);
    return res.data;
  } catch (error: any) {
    console.error("Failed to update");
    console.log("Failed to update post:", error);
    return null;
  }
};
