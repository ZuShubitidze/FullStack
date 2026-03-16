import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/Authcontext";
import { uploadToCloudinary } from "@/hooks/uploadToCloudinary";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

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

  // Update Profile Picture
  const { mutateAsync: updateProfile } = useUpdateUser();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !user) return;

    const updateLogic = async () => {
      // Get imageURL from Cloudinary
      const imageUrl = await uploadToCloudinary(image, "users");

      // Save URL to Backend / DB
      const updatedUser = await updateProfile({
        userId: user.id.toString(),
        imageUrl,
      });
      // Update Current User
      setUser(updatedUser);
      // Reset local states
      setIsUploadingImage(false);
      setImage(null);
    };

    toast.promise(updateLogic(), {
      loading: "Updating profile picture...",
      success: "Updated Successfully!",
      error: "Failed to save picture",
    });
  };

  // Cancel Image Update
  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview); // Clean up memory
    setPreview(null);
    setImage(null);
    setIsUploadingImage(false);
  };

  return (
    <main className="flex flex-col gap-10 p-6 rounded-2xl dark:bg-zinc-800 bg-blue-300">
      <h1 className="text-center">Your Profile</h1>

      {user && user.name && user.email && (
        <section>
          <h2>Name: {user.name}</h2>
          <h2>Email: {user.email}</h2>
        </section>
      )}
      {/* Image Section */}
      {user?.Image && (
        <section>
          <img src={user.Image} alt="Profile Picture" className="w-60" />
          <Button
            onClick={() => setIsUploadingImage(true)}
            disabled={isUploadingImage}
          >
            {user.Image ? "Update" : "Upload"} Profile Picture
          </Button>
        </section>
      )}

      {isUploadingImage && (
        <form onSubmit={handleSubmit}>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-40 rounded object-cover"
            />
          )}
          <Button type="submit">Submit</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </form>
      )}
    </main>
  );
};

export default ProfilePage;
