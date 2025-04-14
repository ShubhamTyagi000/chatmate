import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { getUsers, getMessages, sendMessage } from "../controllers/message.controller.js";

const messageRoutes = Router();

messageRoutes.get('/users', auth, getUsers);
messageRoutes.get('/:id', auth, getMessages);
messageRoutes.post('/send/message/:id', auth, sendMessage);


export default messageRoutes;