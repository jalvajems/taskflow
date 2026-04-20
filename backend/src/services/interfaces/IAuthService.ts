import { UserResponseDto } from "../../dtos/UserResponseDto";
import { IUser } from "../../interfaces/IUser";

export interface IAuthService {
    register(userData: Partial<IUser>): Promise<UserResponseDto>;
    login(email: string, password: string): Promise<{ user: UserResponseDto; token: string }>;
    forgotPassword(email: string): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    resetPassword(email: string, newPassword: string): Promise<boolean>;

}
