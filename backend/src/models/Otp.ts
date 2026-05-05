import mongoose, { Schema } from 'mongoose';
import { IOTP } from '../interfaces/IOtp';

const OtpSchema: Schema = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } } 
});

export default mongoose.model<IOTP>('OTP', OtpSchema);
