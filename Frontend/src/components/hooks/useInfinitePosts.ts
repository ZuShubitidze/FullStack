import { useCallback, useEffect, useState } from "react";
import api from "@/api";
import type { Post } from "@/types/post.interface";

export const useInfinitePosts = (search: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Clear posts when search changes
  useEffect(() => {
    setPosts([]);
    setNextCursor(null);
    setHasMore(true);
  }, [search]);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      // 2. The URL handles fetch, if Search is empty, all posts are fetched
      const query = `/posts/infinite?limit=10&search=${search}${cursor ? `&cursor=${cursor}` : ""}`;
      const { data } = await api.get(query);

      setPosts((prev) => [...prev, ...data.posts]);
      setNextCursor(data.nextCursor);
      if (!data.nextCursor) setHasMore(false);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading, search]);

  return { posts, loading, hasMore, fetchPosts };
};
