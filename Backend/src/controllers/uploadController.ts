import cloudinary from "../lib/cloudinary.js";
import type { Request, Response } from "express";

const getSignature = (req: Request, res: Response) => {
  const { paramsToSign } = req.body; // timestamp, folder: "posts" ...

  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudinaryApiSecret) {
    throw new Error(
      "cloudinaryApiSecret is not defined in the environment variables",
    );
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinaryApiSecret,
  );

  res.status(200).json({ signature });
};

export { getSignature };
