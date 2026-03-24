import api from "@/api";
import type { Post } from "@/types/post.interface";
import { useQuery } from "@tanstack/react-query";

export const usePost = (postId: string | undefined) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${postId}`);
      return data.data.post as Post;
    },
    enabled: !!postId, // Only fetch if we have an ID
    staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
  });
};

export const usePostComments = (postId: string | undefined) => {
  return useQuery({
    queryKey: ["post", postId, "comments"],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${postId}/comments`);
      return data;
    },
    enabled: !!postId,
    staleTime: 1000 * 60, // Comments get stale faster than the post
  });
};
