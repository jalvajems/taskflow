import express from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../utils/types';
import { IAuthController } from '../controllers/interfaces/IAuthController';
import { validate } from '../middleware/validate';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyOtpSchema
} from '../utils/schemas';

const router = express.Router();
const authController = container.get<IAuthController>(TYPES.AuthController);

router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword.bind(authController));
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp.bind(authController));
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword.bind(authController));
router.post('/resend-otp', authController.resendOtp.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));
router.post('/logout', authController.logout.bind(authController));

export default router;
