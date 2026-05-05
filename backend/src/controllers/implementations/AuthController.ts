import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../utils/types';
import { IAuthService } from '../../services/interfaces/IAuthService';
import { IAuthController } from '../interfaces/IAuthController';
import { STATUS_CODE } from '../../constants/StatusCode';

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(TYPES.AuthService) private authService: IAuthService
    ) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.authService.register(req.body);
            res.status(STATUS_CODE.CREATED).json(user);
        } catch (error: unknown) {
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
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


            res.status(STATUS_CODE.SUCCESS).json({ user, accessToken });
        } catch (error: unknown) {
            res.status(STATUS_CODE.UNAUTHORIZED).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            await this.authService.forgotPassword(req.body.email);
            res.status(STATUS_CODE.SUCCESS).json({ message: "OTP sent to your email" });
        } catch (error: unknown) {
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            await this.authService.verifyOtp(email, otp);
            res.status(STATUS_CODE.SUCCESS).json({ message: "OTP verified successfully" });
        } catch (error: unknown) {
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, newPassword } = req.body;
            await this.authService.resetPassword(email, newPassword);
            res.status(STATUS_CODE.SUCCESS).json({ message: "Password reset successful" });
        } catch (error: unknown) {
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, type } = req.body;
            await this.authService.resendOtp(email, type);
            res.status(STATUS_CODE.SUCCESS).json({ message: "OTP resent successfully" });
        } catch (error: unknown) {
            res.status(STATUS_CODE.BAD_REQUEST).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies.refreshToken;
            const result = await this.authService.refreshToken(token);
            res.status(STATUS_CODE.SUCCESS).json(result);
        } catch (error: unknown) {
            res.status(STATUS_CODE.UNAUTHORIZED).json({ message: error instanceof Error ? error.message : "An unknown error occurred" });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
        });
        res.status(STATUS_CODE.SUCCESS).json({ message: "Logged out successfully" });
    }
}
