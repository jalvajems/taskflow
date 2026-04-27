"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_config_1 = require("../config/inversify.config");
const types_1 = require("../utils/types");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../utils/schemas");
const router = express_1.default.Router();
const authController = inversify_config_1.container.get(types_1.TYPES.AuthController);
router.post('/register', (0, validate_1.validate)(schemas_1.registerSchema), authController.register.bind(authController));
router.post('/login', (0, validate_1.validate)(schemas_1.loginSchema), authController.login.bind(authController));
router.post('/forgot-password', (0, validate_1.validate)(schemas_1.forgotPasswordSchema), authController.forgotPassword.bind(authController));
router.post('/verify-otp', (0, validate_1.validate)(schemas_1.verifyOtpSchema), authController.verifyOtp.bind(authController));
router.post('/reset-password', (0, validate_1.validate)(schemas_1.resetPasswordSchema), authController.resetPassword.bind(authController));
exports.default = router;
