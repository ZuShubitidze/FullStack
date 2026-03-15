import api from "@/api";
import { useAuth } from "@/context/Authcontext";
import type { Comment, Post } from "@/types/post.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateComment {
  postId: number;
  updateComment: string;
  id: number;
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    // Function
    mutationFn: async ({ postId, updateComment, id }: UpdateComment) => {
      if (!user) throw new Error("You must be logged in");
      const { data } = await api.put(`/posts/${postId}/comments`, {
        updateComment,
        id,
      });
      return data;
    },

    // Optimistic Update
    onMutate: async ({ postId, id, updateComment }) => {
      const queryKey = ["post", postId.toString()];

      // Cancel ongoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData<Post>(queryKey);

      // Optimistic update
      queryClient.setQueryData<Post>(queryKey, (oldPost) => {
        if (!oldPost) return oldPost;

        // Map through posts to find the one containing our comment
        const updateInTree = (comments: Comment[]): Comment[] => {
          return comments.map((comment) => {
            // If this is the comment we're updating
            if (comment.id === id) {
              return { ...comment, content: updateComment };
            }
            // If it has replies
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: updateInTree(comment.replies) };
            }
            return comment;
          });
        };

        return {
          ...oldPost,
          comments: updateInTree(oldPost.comments || []),
        };
      });

      // Return a context result with the snapshotted value
      return { previousPosts };
    },

    // Error
    onError: (err, variables, context) => {
      // If mutation fails, use context to roll back
      if (context?.previousPosts) {
        queryClient.setQueryData(
          ["post", variables.postId.toString()],
          context.previousPosts,
        );
      }
      toast.error(`Failed to update: ${err.message}`);
    },

    // Refetch after success or error to stay in sync with DB
    onSettled: (_data, _error, variables) => {
      // Sync with server
      queryClient.invalidateQueries({
        queryKey: ["post", variables.postId.toString()],
      });
    },
  });
};
