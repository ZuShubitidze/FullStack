import api from "@/api";
import axios from "axios";

// Upload to Cloudinary
export const uploadToCloudinary = async (file: File, folderName: string) => {
  // Signature Params
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = folderName;

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
  formData.append("folder", folderName);

  // Upload directly to Cloudinary
  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData,
    {
      withCredentials: false, // Override Axios global settings
      headers: {
        Authorization: undefined, // Explicitly remove any global auth headers
      },
    },
  );
  return res.data.secure_url; // The image link for Neon
};
