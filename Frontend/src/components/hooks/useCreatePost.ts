import api from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: {
      title: string;
      content: string;
      authorId: number;
      imageUrl: string;
    }) => {
      const { data } = await api.post("/posts/createPost", newPost);
      return data;
    },
    onSuccess: () => {
      // Refresh the feed
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
