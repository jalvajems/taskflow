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
            const { user, accessToken, refreshToken } = await this.authService.login(email, password);
            
res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true, 
    sameSite: 'none', 
    maxAge: 7 * 24 * 60 * 60 * 1000 
});


            res.status(200).json({ user, accessToken });
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

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, type } = req.body;
            await this.authService.resendOtp(email, type);
            res.status(200).json({ message: "OTP resent successfully" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies.refreshToken;
            const result = await this.authService.refreshToken(token);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
}
