import express from "express";
import { createComment, updateComment, } from "../controllers/commentController.js";
const router = express.Router();
router.post("/", createComment);
router.put("/", updateComment);
export default router;
//# sourceMappingURL=commentRoutes.js.map