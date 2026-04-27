import express,{Application,Request,Response} from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from "cors";
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';


dotenv.config();

connectDB();

const app:Application = express();
const server = http.createServer(app);

const io= new Server(server,{
    cors:{
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods:["GET", "POST", "PUT", "DELETE"]
    }
});

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import jwt from 'jsonwebtoken';

io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
        socket.data.user = decoded;
        next();
    } catch (err) {
        return next(new Error('Authentication error'));
    }
});

io.on('connection',(socket)=>{
    const userId = socket.data.user.id;
    console.log('A user connected:', socket.id, 'UserId:', userId);
    socket.join(userId);

    socket.on('disconnect',()=>{
        console.log('User disconnected:', socket.id);
    });
});

app.get('/health',(req:Request,res:Response)=>{
    res.status(200).json({status:'OK',message:'taskflow api is running'});
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export {io};