"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../utils/types");
const hashPassword_1 = require("../../utils/hashPassword");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserMapper_1 = require("../../mappers/UserMapper");
const mailUtils_1 = require("../../utils/mailUtils");
let AuthService = class AuthService {
    userRepository;
    otpRepository;
    constructor(userRepository, otpRepository // Inject it
    ) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
    }
    async register(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser)
            throw new Error("User already exists");
        userData.password = await (0, hashPassword_1.hashPassword)(userData.password);
        const user = await this.userRepository.create(userData);
        return UserMapper_1.UserMapper.toResponseDto(user);
    }
    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            throw new Error("Invalid credentials");
        const isMatch = await (0, hashPassword_1.comparePassword)(password, user.password);
        if (!isMatch)
            throw new Error("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: '1d' });
        return { user: UserMapper_1.UserMapper.toResponseDto(user), token };
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            throw new Error("If an account exists with this email, you will receive an OTP.");
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Store OTP in database
        await this.otpRepository.create({ email, otp });
        // Send Email
        await (0, mailUtils_1.sendOtpEmail)(email, otp);
    }
    async verifyOtp(email, otp) {
        const latestOtp = await this.otpRepository.findLatestByEmail(email);
        if (!latestOtp || latestOtp.otp !== otp) {
            throw new Error("Invalid or expired OTP");
        }
        return true;
    }
    async resetPassword(email, newPassword) {
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            throw new Error("User not found");
        // Hash new password
        const hashedPassword = await (0, hashPassword_1.hashPassword)(newPassword);
        // Update user
        const updatedUser = await this.userRepository.update(user._id.toString(), { password: hashedPassword });
        if (updatedUser) {
            // Delete the OTP after successful reset
            await this.otpRepository.deleteByEmail(email);
            return true;
        }
        return false;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.OtpRepository)),
    __metadata("design:paramtypes", [Object, Object])
], AuthService);
