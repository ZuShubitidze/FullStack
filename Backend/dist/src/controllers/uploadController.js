import cloudinary from "../lib/cloudinary.js";
const getSignature = (req, res) => {
    const { paramsToSign } = req.body; // timestamp, folder: "posts" ...
    const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudinaryApiSecret) {
        throw new Error("cloudinaryApiSecret is not defined in the environment variables");
    }
    try {
        const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinaryApiSecret);
        res.status(200).json({ signature });
    }
    catch (error) {
        res.status(500).json({ message: "Signature generation failed" });
    }
};
export { getSignature };
//# sourceMappingURL=uploadController.js.map