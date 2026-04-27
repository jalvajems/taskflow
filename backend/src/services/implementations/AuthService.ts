import { injectable, inject } from 'inversify';
import { TYPES } from '../../utils/types';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IAuthService } from '../interfaces/IAuthService';
import { hashPassword, comparePassword } from '../../utils/hashPassword';
import jwt from 'jsonwebtoken';
import { IUser } from '../../interfaces/IUser';
import { UserMapper } from '../../mappers/UserMapper';
import { UserResponseDto } from '../../dtos/UserResponseDto';
import { IOtpRepository } from '../../repositories/interfaces/IOtpRepository';
import { sendOtpEmail } from '../../utils/mailUtils';

@injectable()
export class AuthService implements IAuthService {

    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.OtpRepository) private otpRepository: IOtpRepository // Inject it

    ) {
        this.userRepository = userRepository;
        this.otpRepository=otpRepository;
    }

    async register(userData: Partial<IUser>): Promise<UserResponseDto> {
        const existingUser = await this.userRepository.findByEmail(userData.email!);
        if (existingUser) {
            if (existingUser.isVerified) {
                throw new Error("User already exists");
            } else {
                // User exists but is not verified, we can update and send new OTP
                userData.password = await hashPassword(userData.password!);
                await this.userRepository.update(existingUser._id.toString(), userData as any);
            }
        } else {
            userData.password = await hashPassword(userData.password!);
            await this.userRepository.create(userData);
        }

        // Generate and send OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.otpRepository.create({ email: userData.email, otp } as any);
        await sendOtpEmail(userData.email!, otp, 'registration');

        const user = await this.userRepository.findByEmail(userData.email!);
        return UserMapper.toResponseDto(user!);
    }

    async login(email: string, password: string): Promise<{ user: UserResponseDto; token: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("Invalid credentials");

        if (!user.isVerified) {
            throw new Error("Account not verified. Please check your email for OTP.");
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || "secret", 
            { expiresIn: '1d' }
        );
        
        return { user:UserMapper.toResponseDto(user), token };
    }

    async resendOtp(email: string, type: 'registration' | 'reset'): Promise<void> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.otpRepository.create({ email, otp } as any);
        await sendOtpEmail(email, otp, type);
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("If an account exists with this email, you will receive an OTP.");
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.otpRepository.create({ email, otp } as any);
        await sendOtpEmail(email, otp, 'reset');
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const latestOtp = await this.otpRepository.findLatestByEmail(email);
        
        if (!latestOtp || latestOtp.otp !== otp) {
            throw new Error("Invalid or expired OTP");
        }

        // Mark user as verified if it was a registration OTP
        const user = await this.userRepository.findByEmail(email);
        if (user && !user.isVerified) {
            await this.userRepository.update(user._id.toString(), { isVerified: true } as any);
        }

        await this.otpRepository.deleteByEmail(email);
        return true;
    }
    async resetPassword(email: string, newPassword: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("User not found");
        // Hash new password
        const hashedPassword = await hashPassword(newPassword);
        
        // Update user
        const updatedUser = await this.userRepository.update(user._id.toString(), { password: hashedPassword } as any);
        
        if (updatedUser) {
            // Delete the OTP after successful reset
            await this.otpRepository.deleteByEmail(email);
            return true;
        }
        
        return false;
    }

}
