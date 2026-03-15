import cloudinary from "src/lib/cloudinary.js";
const getSignature = (req, res) => {
    const { paramsToSign } = req.body; // timestamp, folder: "posts" ...
    try {
        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
        res.status(200).json({ signature });
    }
    catch (error) {
        res.status(500).json({ message: "Signature generation failed" });
    }
};
export { getSignature };
//# sourceMappingURL=uploadController.js.map