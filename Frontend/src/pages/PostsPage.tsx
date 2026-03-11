import { useInfinitePosts } from "@/components/hooks/useInfinitePosts";
import { useEffect, useRef } from "react";
import { Link } from "react-router";

const PostsPage = () => {
  const { fetchPosts, hasMore, loading, posts } = useInfinitePosts();
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchPosts();
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchPosts]);

  console.log(posts, loading, hasMore);

  return (
    <main>
      <h1 className="text-3xl text-center my-4">Posts</h1>
      <ol className="flex flex-col gap-2 dark:bg-zinc-800 bg-blue-300">
        {posts.length > 1 &&
          posts.map(({ title, content, author, id }) => (
            <Link to={`/posts/${id}`} key={id}>
              <li className="p-4 flex flex-col gap-2 border-b-2">
                <h1>
                  Title: <strong>{title}</strong>
                </h1>
                <p>{content}</p>
                <p>Author: {author.name}</p>
              </li>
            </Link>
          ))}
      </ol>
      <div ref={loaderRef} className="h-20 flex items-center justify-center">
        {loading && <p>Loading more posts...</p>}
        {!hasMore && <p>You've reached the end!</p>}
      </div>
    </main>
  );
};

export default PostsPage;
