import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();

app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true,
    }
));

app.use(express.json({limit:"8kb"}));
app.use(express.urlencoded({extended:true,limit:"8kb"}));
app.use(express.static('public'));
app.use(cookieParser());

// Importing routes

import userRouter from './routes/users.routes.js';



// routes declaration
app.use('/api/user', userRouter);

export default app;