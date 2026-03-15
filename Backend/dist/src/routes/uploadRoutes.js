import express from "express";
import { getSignature } from "../controllers/uploadController.js";
const router = express.Router();
router.post("/sign-upload", getSignature);
export default router;
//# sourceMappingURL=uploadRoutes.js.map