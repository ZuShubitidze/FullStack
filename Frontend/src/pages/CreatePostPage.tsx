import { createPost } from "@/components/hooks/createPost";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/Authcontext";
import { useState } from "react";

const CreatePostPage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Give title, content and userID to hook that calls backend
    await createPost(title, content, user.id);
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Create Post</FieldLegend>
          {/* Title */}
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          {/* Content */}
          <Field>
            <FieldLabel htmlFor="content">Content</FieldLabel>
            <Input
              id="content"
              placeholder="Post Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Field>
          <Button type="submit">Post</Button>
        </FieldSet>
      </form>
    </main>
  );
};

export default CreatePostPage;
