import express from "express";
import validateBody from "../middleware/validateBody.js";
import { requestResetEmailSchema, resetPasswordSchema } from "../validations/authValidation.js";
import { requestResetEmail, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/request-reset-email", validateBody(requestResetEmailSchema), requestResetEmail);
router.post("/reset-password", validateBody(resetPasswordSchema), resetPassword);

export default router;
