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
        if (existingUser) throw new Error("User already exists");

        userData.password = await hashPassword(userData.password!);
        const user=await this.userRepository.create(userData);
        return UserMapper.toResponseDto(user)
    }

    async login(email: string, password: string): Promise<{ user: UserResponseDto; token: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || "secret", 
            { expiresIn: '1d' }
        );
        
        return { user:UserMapper.toResponseDto(user), token };
    }
    async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("If an account exists with this email, you will receive an OTP.");
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in database
        await this.otpRepository.create({ email, otp } as any);
        // Send Email
        await sendOtpEmail(email, otp);
    }
    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const latestOtp = await this.otpRepository.findLatestByEmail(email);
        
        if (!latestOtp || latestOtp.otp !== otp) {
            throw new Error("Invalid or expired OTP");
        }
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
