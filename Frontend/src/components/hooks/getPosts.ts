import api from "@/api";
import type { Post } from "@/types/post.interface";

export const getPosts = async () => {
  try {
    const res = await api.get("/posts");

    return res.data.data.posts as Post[];
  } catch (error) {
    console.log("Error fetching posts");
  }
};
