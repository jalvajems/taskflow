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

export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
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
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};
