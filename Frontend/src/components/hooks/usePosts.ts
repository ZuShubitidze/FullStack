import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/api";

export const usePosts = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["posts", search], // Cache results based on search term
    queryFn: async ({ pageParam = null }) => {
      const { data } = await api.get(`/posts/infinite`, {
        params: {
          limit: 10,
          search: search,
          cursor: pageParam,
        },
      });
      return data;
    },
    initialPageParam: null,
    // Tell React Query what the next cursor is
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,

    // --- CACHING SETTINGS ---
    staleTime: 1000 * 60, // 1 minute: Data stays "fresh" (no background refetch)
    gcTime: 1000 * 60 * 5, // 5 minutes: Data stays in memory after leaving the page
  });
};
