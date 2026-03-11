import api from "@/api";
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
    // 1. Get Signature from your Render Backend
    const timestamp = Math.round(new Date().getTime() / 1000);
    const {
      data: { signature },
    } = await api.post("/upload/sign-upload", {
      paramsToSign: { timestamp, folder: "posts" },
    });

    // 2. Upload directly to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", "posts");

    const res = await axios.post(
      `https://api.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
    );
    return res.data.secure_url; // The image link for Neon
  };

  // Create Post
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postLogic = async () => {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }
      // Give title, content, userID and Image to hook that calls backend
      return createPost(title, content, user.id, imageUrl);
    };

    toast.promise(postLogic(), {
      loading: "Uploading and posting...",
      success: () => {
        navigate("/posts");
        return "Post published!";
      },
      error: "Failed to create post",
    });
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
