import api from "@/api";
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
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CreatePostPage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  // Image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show local preview
    }
  };
  // Upload to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    // Signature Params
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "posts";

    // Get Signature from my API
    const {
      data: { signature },
    } = await api.post("/upload/sign-upload", {
      paramsToSign: { timestamp, folder },
    });

    // Append Data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", "posts");

    // Upload directly to Cloudinary
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
    );
    return res.data.secure_url; // The image link for Neon
  };

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
        imageUrl = await uploadToCloudinary(image);
      }
      // Give title, content, userID and Image to useMutate hook
      create(
        { title, content, authorId: user.id, imageUrl },
        {
          onSuccess: () => navigate("/posts"),
        },
      );
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
