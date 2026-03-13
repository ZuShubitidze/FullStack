import api from "@/api";
import { useQuery } from "@tanstack/react-query";

export const usePost = async (postId: string | undefined) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${postId}`);
      return data.data.post;
    },
    enabled: !!postId, // Only fetch if we have an ID
    staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
  });
};
