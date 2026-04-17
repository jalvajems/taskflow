import express,{Application,Request,Response} from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from "cors";
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';


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

io.on('connection',(socket)=>{
    console.log('A user connected:',socket.id);
    socket.on('disconnect',()=>{
        console.log('User disconnected');
    });
});

app.get('/health',(req:Request,res:Response)=>{
    res.status(200).json({status:'OK',message:'taskflow api is running'});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export {io};