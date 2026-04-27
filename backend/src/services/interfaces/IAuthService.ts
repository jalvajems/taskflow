import { UserResponseDto } from "../../dtos/UserResponseDto";
import { IUser } from "../../interfaces/IUser";

export interface IAuthService {
    register(userData: Partial<IUser>): Promise<UserResponseDto>;
    login(email: string, password: string): Promise<{ user: UserResponseDto; accessToken: string; refreshToken: string }>;
    forgotPassword(email: string): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    resetPassword(email: string, newPassword: string): Promise<boolean>;
    resendOtp(email: string, type: 'registration' | 'reset'): Promise<void>;
    refreshToken(token: string): Promise<{ accessToken: string }>;
}
