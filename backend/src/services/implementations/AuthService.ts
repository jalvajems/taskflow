import { injectable, inject } from 'inversify';
import { TYPES } from '../../utils/types';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { IAuthService } from '../interfaces/IAuthService';
import { hashPassword, comparePassword } from '../../utils/hashPassword';
import jwt from 'jsonwebtoken';
import { IUser } from '../../interfaces/IUser';
import { UserMapper } from '../../mappers/UserMapper';
import { UserResponseDto } from '../../dtos/UserResponseDto';

@injectable()
export class AuthService implements IAuthService {
    private userRepository: IUserRepository;

    constructor(
        @inject(TYPES.UserRepository) userRepository: IUserRepository
    ) {
        this.userRepository = userRepository;
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
}
