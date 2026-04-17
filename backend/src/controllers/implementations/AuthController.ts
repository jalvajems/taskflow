import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../utils/types';
import { IAuthService } from '../../services/interfaces/IAuthService';
import { IAuthController } from '../interfaces/IAuthController';

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(TYPES.AuthService) private authService: IAuthService
    ) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            await this.authService.forgotPassword(req.body.email);
            res.status(200).json({ message: "OTP sent to your email" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            await this.authService.verifyOtp(email, otp);
            res.status(200).json({ message: "OTP verified successfully" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, newPassword } = req.body;
            await this.authService.resetPassword(email, newPassword);
            res.status(200).json({ message: "Password reset successful" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
