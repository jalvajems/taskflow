"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static toResponseDto(user) {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };
    }
}
exports.UserMapper = UserMapper;
