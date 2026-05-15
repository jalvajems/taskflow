import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
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

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn(`[OTP DEV MODE] Email config missing. Simulated sending OTP ${otp} to ${email}`);
        return;
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 OTP sent to ${email}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
        console.warn(`[OTP DEV MODE] Failed to send email. Simulated sending OTP ${otp} to ${email}`);
        // Do not throw to allow registration to proceed without email setup
    }
};
