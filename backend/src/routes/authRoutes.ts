import express from 'express';
import { container } from '../config/inversify.config';
import { TYPES } from '../utils/types';
import { IAuthController } from '../controllers/interfaces/IAuthController';

const router = express.Router();
const authController = container.get<IAuthController>(TYPES.AuthController);

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/verify-otp', authController.verifyOtp.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));

export default router;
