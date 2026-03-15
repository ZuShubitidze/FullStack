import { useCreatePost } from "@/hooks/useCreatePost";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/Authcontext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/hooks/uploadToCloudinary";

const CreatePostPage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show local preview
    }
  };

  // Cleanup function to free up memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Create Post
  const { mutateAsync: create, isPending } = useCreatePost();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create Post
    const postLogic = async () => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      let imageUrl = "";
      if (image) {
        // Upload to Cloudinary first
        imageUrl = await uploadToCloudinary(image, "posts");
      }
      // Give title, content, userID and Image to useMutate hook
      return await create({ title, content, authorId: user.id, imageUrl });
    };

    toast.promise(postLogic(), {
      loading: "Uploading and posting...",
      success: () => {
        return "Post published!";
      },
      error: (err) => err?.message || "Failed to create post",
    });
  };

  if (isPending) return <SkeletonCard />;

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
          {/* Image */}
          <Field>
            <FieldLabel>Post Image</FieldLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <img src={preview} className="mt-2 h-40 rounded object-cover" />
            )}
          </Field>
          <Button type="submit">Post</Button>
        </FieldSet>
      </form>
    </main>
  );
};

export default CreatePostPage;
