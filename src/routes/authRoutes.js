import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshUserSession,
    requestResetEmail,
    resetPassword,
} from '../controllers/authController.js';
import {
    registerUserSchema,
    loginUserSchema,
    requestResetEmailSchema,
    resetPasswordSchema,
} from '../validations/authValidation.js';

const router = Router();

router.post('/register', celebrate({ body: registerUserSchema }), registerUser);
router.post('/login', celebrate({ body: loginUserSchema }), loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshUserSession);
router.post('/request-reset-email', celebrate({ body: requestResetEmailSchema }), requestResetEmail);
router.post('/reset-password', celebrate({ body: resetPasswordSchema }), resetPassword);

export default router;
