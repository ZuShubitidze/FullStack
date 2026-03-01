import type { Post } from "@/types/post.interface";
import axios from "axios";

export const getPost = async (id: string) => {
  try {
    const res = await axios.get(`http://localhost:3000/posts/${id}`);

    return res.data.data.post as Post;
  } catch (error) {
    console.log("Error fetching posts");
  }
};
