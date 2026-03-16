import api from "@/api";
import { useAuth } from "@/context/Authcontext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (newComment: {
      comment: string;
      authorId: number;
      postId: number;
      parentId?: number;
    }) => {
      if (!user) throw new Error("You must be logged in");
      const { data } = await api.post(`/posts/${postId}/comments`, newComment);

      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific post and the list
      queryClient.invalidateQueries({
        queryKey: ["post", variables.postId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("Post successfully updated");
      navigate(`/posts/${variables.postId}`);
    },
  });
};
