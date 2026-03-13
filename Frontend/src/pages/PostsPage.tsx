import { useDebounce } from "@/components/hooks/useDebounce";
import { usePosts } from "@/components/hooks/usePosts";
import PostCard from "@/components/PostCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Input } from "@/components/ui/input";
import type { Post } from "@/types/post.interface";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

const PostsPage = () => {
  const loaderRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || "",
  );

  // 2. Debounced value (updates 500ms after user stops typing)
  const debouncedSearch = useDebounce(inputValue, 1000);

  // 3. Update URL when debounced value changes
  useEffect(() => {
    setSearchParams(debouncedSearch ? { search: debouncedSearch } : {});
  }, [debouncedSearch, setSearchParams]);

  // 4. Pass the URL query to your Infinite Hook
  const searchQuery = searchParams.get("search") || "";

  // Get elements from React Query Hook
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePosts(searchQuery);

  // Fetch Posts
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into one array of posts
  const allPosts: Post[] = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <main>
      <ol className="flex flex-col gap-10 ">
        <Input
          type="text"
          placeholder="Search Post"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {allPosts.length > 0 ? (
          <section className="flex flex-col gap-4">
            <h1 className="text-3xl text-center my-4">Posts</h1>
            {allPosts.map((post) => (
              <PostCard post={post} />
            ))}
          </section>
        ) : (
          !isFetchingNextPage &&
          status !== "pending" && (
            <p className="text-center p-10 text-zinc-500">
              No posts found matching "{searchQuery}"
            </p>
          )
        )}
      </ol>
      <div ref={loaderRef} className="h-20 flex items-center justify-center">
        {status === "pending" && allPosts.length < 10 && <SkeletonCard />}
      </div>
    </main>
  );
};

export default PostsPage;
