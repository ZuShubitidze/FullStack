import api from "@/api";

export const createComment = async (
  comment: string,
  authorId: number,
  postId: number,
  parentId?: number,
) => {
  try {
    const res = await api.post(`/posts/${postId}/comments`, {
      comment,
      authorId,
      postId,
      parentId,
    });
    if (res.data) {
      console.log("Commented successfully", res.data);
    }
    return res.data.data;
  } catch (error: any) {
    console.error("Error occured while creating post", { error });
    return null;
  }
};
