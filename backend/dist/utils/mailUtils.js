"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // You can change this to 'outlook', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use an "App Password" if using Gmail
    },
});
const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your TaskFlow Password Reset Code',
        text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
        html: `<h3>TaskFlow Password Reset</h3>
               <p>Your OTP for password reset is: <strong>${otp}</strong></p>
               <p>This code will expire in 5 minutes.</p>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 OTP sent to ${email}`);
    }
    catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};
exports.sendOtpEmail = sendOtpEmail;
