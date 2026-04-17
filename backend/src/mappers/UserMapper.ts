import { UserResponseDto } from '../dtos/UserResponseDto';
import { IUser } from '../interfaces/IUser';

export class UserMapper {
    static toResponseDto(user: IUser): UserResponseDto {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };
    }
}
