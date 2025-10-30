import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { updateUserAvatar } from "../controllers/userController.js";

const router = express.Router();

// PATCH /users/me/avatar
router.patch("/me/avatar", auth, upload.single("avatar"), updateUserAvatar);

export default router;
