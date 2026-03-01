import axios from "axios";

export const createPost = async (
  title: string,
  content: string,
  authorId: number,
) => {
  try {
    const res = await axios.post("http://localhost:3000/posts/createPost", {
      title,
      content,
      authorId,
    });
    // Success
    if (res.data) {
      console.log("Posted successfully", res.data);
    }
  } catch (error: any) {
    console.error("Error occured while creating post", { error });
  }
};
