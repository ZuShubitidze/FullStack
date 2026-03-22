import type { Post } from "@/types/post.interface";
import { Link } from "react-router";

const PostCard = ({ post }: { post: Post }) => {
  return (
    <Link to={`/posts/${post.id}`}>
      <li className="p-10 flex flex-col md:flex-row md:justify-between lg:justify-around dark:bg-zinc-800 bg-blue-300 border-b">
        {post.Image && (
          <section>
            <img src={post.Image} alt={post.title} className="w-100 h-100" />
          </section>
        )}
        <section className="flex flex-col justify-around gap-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p>{post.content}</p>
          <div className="flex flex-row items-center gap-2">
            <span>Author: {post.author.name}</span>
            {post.author.Image && (
              <img
                src={post.author.Image}
                alt="Author Profile Picture"
                className="w-10 rounded-4xl"
              />
            )}
          </div>
        </section>
      </li>
    </Link>
  );
};

export default PostCard;
