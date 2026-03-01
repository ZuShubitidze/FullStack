import { getPost } from "@/components/hooks/getPost";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/post.interface";
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
import { putPost } from "@/components/hooks/putPost";
import { useAuth } from "@/context/Authcontext";
import CommentItem from "@/components/CommentItem";
import CreateCommentComponent from "@/components/CreateCommentComponent";

const PostPage = () => {
  const { id }: Readonly<Params<string>> = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post>();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  // Get Post and Comments
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      const postData = await getPost(id);

      if (postData) {
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content || "");
      }
    };

    loadPost();
  }, [id]);

  // Update Post
  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;
    try {
      const response = await putPost(id, title, content);

      if (response) {
        // Close form
        setIsUpdating(false);
        // Update local state for UI
        setPost((prev) => (prev ? { ...prev, title, content } : prev));
      }
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

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
          </section>
          {/* Post Update Section */}
          <section>
            {/* If userID and post authorID are same, allow user to update */}
            {user.id === post.authorId && (
              <Button onClick={() => setIsUpdating(true)} disabled={isUpdating}>
                Update your post
              </Button>
            )}
            {/* Update Form */}
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
                  <Button
                    type="button"
                    onClick={() => {
                      setIsUpdating(false);
                      setTitle(post.title);
                      setContent(post.content);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update</Button>
                </FieldSet>
              </form>
            )}
          </section>
          {/* Create Comment Section */}
          <section>
            <CreateCommentComponent postId={Number(post.id)} />
          </section>
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
    </main>
  );
};

export default PostPage;
