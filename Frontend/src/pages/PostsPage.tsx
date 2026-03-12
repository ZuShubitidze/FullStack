import { useDebounce } from "@/components/hooks/useDebounce";
import { useInfinitePosts } from "@/components/hooks/useInfinitePosts";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";

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
  const { fetchPosts, hasMore, loading, posts } = useInfinitePosts(searchQuery);

  // Fetch Posts
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts();
          console.log("Fetched Posts:", posts);
        }
      },
      {
        rootMargin: "100px",
      },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchPosts]);

  return (
    <main>
      <h1 className="text-3xl text-center my-4">Posts</h1>
      <Input
        type="text"
        placeholder="Search Post"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <ol className="flex flex-col gap-2 dark:bg-zinc-800 bg-blue-300">
        {posts.length > 0
          ? posts.map(({ title, content, author, id }) => (
              <Link to={`/posts/${id}`} key={id}>
                <li className="p-4 flex flex-col gap-2 border-b-2">
                  <h1>
                    Title: <strong>{title}</strong>
                  </h1>
                  <p>{content}</p>
                  <p>Author: {author.name}</p>
                </li>
              </Link>
            ))
          : !loading && (
              <p className="text-center p-10 text-zinc-500">
                No posts found matching "{searchQuery}"
              </p>
            )}
      </ol>
      <div ref={loaderRef} className="h-20 flex items-center justify-center">
        {loading && <p>Loading more posts...</p>}
        {!hasMore && <p>You've reached the end!</p>}
      </div>
    </main>
  );
};

export default PostsPage;
