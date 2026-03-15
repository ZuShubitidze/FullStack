import type { Post } from "@/types/post.interface";
import { Link } from "react-router";

const PostCard = ({ post }: { post: Post }) => {
  return (
    <Link to={`/posts/${post.id}`}>
      <li className="p-4 flex flex-col gap-2 border-b-2 dark:bg-zinc-800 bg-blue-300">
        <h1>
          <strong>{post.title}</strong>
        </h1>
        <p>{post.content}</p>
        <p>Author: {post.author.name}</p>
      </li>
    </Link>
  );
};

export default PostCard;
