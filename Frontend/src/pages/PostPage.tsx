import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useParams, type Params } from "react-router";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/Authcontext";
import CommentItem from "@/components/CommentItem";
import CreateCommentComponent from "@/components/CreateCommentComponent";
import { toast } from "sonner";
import { useDeletePost } from "@/hooks/useDeletePost";
import { usePost } from "@/hooks/usePost";
import { SkeletonCard } from "@/components/SkeletonCard";
import ErrorComponent from "@/components/error/ErrorComponent";
import { useUpdatePost } from "@/hooks/useUpdatePost";

const PostPage = () => {
  const { id }: Readonly<Params<string>> = useParams();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  // Delete
  const { mutate: deletePost } = useDeletePost();
  // Fetch
  const { data: post, isLoading, error } = usePost(id);
  const isOwner = user?.id === post?.authorId;
  // Update Post
  const { mutate: update, isPending } = useUpdatePost();
  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    update(
      { postId: post.id, title, content },
      {
        onSuccess: () => {
          setIsUpdating(false); // Close the form only if it actually worked!
          toast.success("Changes saved.");
          console.log("Updated Post:", title, content);
        },
      },
    );
  };

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  if (error) return;

  return (
    <main>
      {post && (
        <section className="flex flex-col gap-10 dark:bg-zinc-800 bg-blue-300 p-4">
          {/* Post Section */}
          <section className="flex flex-col gap-4">
            <h1>
              Title: <strong>{post.title}</strong>
            </h1>
            <p>{post.content}</p>
            <p>Author: {post.author.name}</p>
            {post.Image && <img src={post.Image} alt={post.title} />}
            {isOwner && (
              <Button
                onClick={() => deletePost(post.id)}
                className="text-red-500"
              >
                Delete
              </Button>
            )}
          </section>
          {/* Post Update Section */}
          <section>
            {/* If userID and post authorID are same, allow user to update */}
            {user && user.id === post.authorId && (
              <Button onClick={() => setIsUpdating(true)} disabled={isUpdating}>
                Update your post
              </Button>
            )}
            {/* Update PostForm */}
            {isUpdating && (
              <form onSubmit={handlePostUpdate} className="mt-20">
                <FieldSet>
                  <FieldLegend className="text-3xl text-center">
                    Update your Post
                  </FieldLegend>
                  {/* Title */}
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      id="title"
                      placeholder="Update Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Field>
                  {/* Content */}
                  <Field>
                    <FieldLabel htmlFor="content">Content</FieldLabel>
                    <Textarea
                      id="content"
                      placeholder="Update Content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </Field>
                  {/* Update Button */}
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Updating..." : "Update"}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsUpdating(false);
                      setTitle(post.title);
                      setContent(post.content);
                    }}
                  >
                    Cancel
                  </Button>
                </FieldSet>
              </form>
            )}
          </section>
          {/* Create Comment Section */}
          {user && (
            <section>
              <CreateCommentComponent postId={Number(post.id)} />
            </section>
          )}
          {/* Comments Section */}
          <section>
            <ul className="flex flex-col gap-10 p-10">
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <li key={comment.id}>
                    <CommentItem comment={comment} postId={Number(post.id)} />
                  </li>
                ))
              ) : (
                <h1>No Comments</h1>
              )}
            </ul>
          </section>
        </section>
      )}
      {isLoading && <SkeletonCard />}
      {error && <ErrorComponent content="Fetching Post" />}
    </main>
  );
};

export default PostPage;
