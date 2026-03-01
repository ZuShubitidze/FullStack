import type { Post } from "@/types/post.interface";
import axios from "axios";

export const getPosts = async () => {
  try {
    const res = await axios.get("http://localhost:3000/posts");

    return res.data.data.posts as Post[];
  } catch (error) {
    console.log("Error fetching posts");
  }
};
