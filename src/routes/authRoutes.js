import express from "express";
import { requestResetEmail } from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/request-reset-email", requestResetEmail);

export default router;
