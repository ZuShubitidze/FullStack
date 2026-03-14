// import "dotenv/config";
// import express from "express";
// import { protect } from "../middleware/protect.js";
// import { v2 as cloudinary } from "cloudinary";
// import { upload } from "../controllers/uploadController.js";
export {};
// const router = express.Router();
// router.post("/", upload);
// Check if vars exist before configuring
// if (!process.env.CLOUDINARY_CLOUD_NAME) {
//   console.error("CRITICAL: Cloudinary env variables are missing!");
// } else {
//   console.log(`Cloud Name:, ${process.env.CLOUDINARY_CLOUD_NAME}`);
// }
// Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
// router.post(
//   "/sign-upload",
//   // protect,
//   (req, res) => {
//     console.log("Route is alive");
//     res.json({ message: "Route is alive" });
// const { paramsToSign } = req.body;
// try {
//   // Generate signature using Cloudinary utility
//   const signature = cloudinary.utils.api_sign_request(
//     paramsToSign,
//     process.env.CLOUDINARY_API_SECRET,
//   );
//   res.json({ signature });
// } catch (error) {
//   res.status(500).json({ message: "Failed to generate signature" });
// }
//   },
// );
// export default router;
//# sourceMappingURL=uploadRoutes.js.map