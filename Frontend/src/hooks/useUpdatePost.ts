import api from "@/api";
import { useAuth } from "@/context/Authcontext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface UpdatePostData {
  postId: number;
  title: string;
  content: string;
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ postId, title, content }: UpdatePostData) => {
      if (!user) throw new Error("You must be logged in");
      const { data } = await api.put(`/posts/${postId}`, {
        title,
        content,
      });
      return data;
    },

    // Error
    onError: (err, postId) => {
      toast.error(
        `Failed to update post ID - ${postId}. Please try again. Error - ${err}`,
      );
    },

    // 3. ALWAYS: Refetch after success or error to stay in sync with DB
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
