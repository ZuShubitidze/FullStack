import { useState } from "react";
import api from "@/api";
import type { Post } from "@/types/post.interface";

export const useInfinitePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { data } = await api.get(
        `/posts/infinite?limit=5${cursor ? `&cursor=${cursor}` : ""}`,
      );
      setPosts((prev) => [...prev, ...data.posts]);
      setNextCursor(data.nextCursor);
      if (!data.nextCursor) setHasMore(false);
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, hasMore, fetchPosts };
};
