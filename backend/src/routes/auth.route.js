import { Router } from "express";
import { signup, login, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/signup", signup);
authRoutes.put('/update/profile', auth, upload.any(), updateProfile);
authRoutes.get('/check/auth', auth, checkAuth);
export default authRoutes;
