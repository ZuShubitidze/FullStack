import api from "@/api";
import type { Post } from "@/types/post.interface";

export const getPost = async (id: string) => {
  try {
    const res = await api.get(`/posts/${id}`);

    return res.data.data.post as Post;
  } catch (error) {
    console.log("Error fetching posts");
  }
};
