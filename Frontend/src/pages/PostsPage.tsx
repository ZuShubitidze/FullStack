import { getPosts } from "@/components/hooks/getPosts";
import type { Post } from "@/types/post.interface";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  // Cheat with useEffect to call async function
  useEffect(() => {
    const loadPosts = async () => {
      const data = await getPosts(); // <--- Wait for the promise here
      if (data) setPosts(data);
    };

    loadPosts();
  }, []);

  return (
    <main>
      <h1 className="text-3xl text-center my-4">Posts</h1>
      <ol className="flex flex-col gap-2 dark:bg-zinc-800 bg-blue-300">
        {posts.map(({ title, content, author, id }) => (
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
    </main>
  );
};

export default PostsPage;
