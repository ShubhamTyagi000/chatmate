import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(400).send({ success: false, messsage: 'No token provided' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).send({ success: false, message: 'Invalid token', data: null });
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(404).send({ success: false, message: 'User not found', data: null });

        req.user = user;
        next();
        

    } catch (error) {
        console.log('error', error)
        res.status(500).send({ success: false, message: 'Something went wrong', data: null });
    }
}