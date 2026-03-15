import api from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      toast.success("Post published!");
      navigate("/posts");
    },
  });
};
