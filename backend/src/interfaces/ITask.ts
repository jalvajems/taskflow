import mongoose, { Document } from "mongoose";

export interface ITask extends Document {
    _id: mongoose.Types.ObjectId; 
    title: string;
    description: string;
    status: 'pending' | 'completed';
    dueDate: Date;
    userId: mongoose.Types.ObjectId;
    createdAt: Date; 
    updatedAt: Date;
}
