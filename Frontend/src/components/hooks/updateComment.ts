import api from "@/api";

export const updateCommentHook = async (
  comment: string,
  postId: number,
  id: number,
) => {
  try {
    const res = await api.put(`/posts/${postId}/comments`, {
      comment,
      id,
    });
    if (res.data) {
      console.log("Commented successfully", res.data);
    }
    return res.data.data;
  } catch (error: any) {
    console.log("Error updating comment:", error);
    console.error("Error updating comment");
  }
};
