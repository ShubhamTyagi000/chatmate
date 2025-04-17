// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.route.js'
import messageRoutes from './src/routes/message.route.js';
import { connectDB } from './src/lib/db.js'
import cookieParser from 'cookie-parser';
import { app, server } from './src/lib/socket.js';
import cors from 'cors';
// import('./src/lib/db.js')

dotenv.config()
// const app = express();
const PORT = process.env.PORT;
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
server.listen(PORT || 3000, () => {
    console.log(`app started at port ${PORT}`);
    connectDB()
})  