// hooks/useDeletePost.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import { toast } from "sonner";
import { useAuth } from "@/context/Authcontext";

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (postId: number) => {
      if (!user) throw new Error("You must be logged in");
      await api.delete(`/posts/${postId}`);
    },

    // 1. THIS RUNS FIRST (Before the API call)
    onMutate: async (postId: number) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous value (for rollback if it fails)
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.filter((p: any) => p.id !== postId),
          })),
        };
      });

      // Return the snapshot
      return { previousPosts };
    },

    // 2. IF IT FAILS: Roll back to the previous state
    onError: (err, postId, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
      toast.error("Failed to delete post. Please try again.");
    },

    // 3. ALWAYS: Refetch after success or error to stay in sync with DB
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
