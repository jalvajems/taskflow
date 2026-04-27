import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to 'outlook', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use an "App Password" if using Gmail
    },
});

export const sendOtpEmail = async (email: string, otp: string, type: 'registration' | 'reset' = 'reset'): Promise<void> => {
    const subject = type === 'registration' ? 'TaskFlow Registration OTP' : 'TaskFlow Password Reset Code';
    const title = type === 'registration' ? 'TaskFlow Registration' : 'TaskFlow Password Reset';
    const action = type === 'registration' ? 'verify your email' : 'reset your password';

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: `Your OTP for ${action} is: ${otp}. It will expire in 5 minutes.`,
        html: `<h3>${title}</h3>
               <p>Your OTP for ${action} is: <strong>${otp}</strong></p>
               <p>This code will expire in 5 minutes.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 OTP sent to ${email}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};
