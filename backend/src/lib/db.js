import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected to host: ${con.connection.host}`)

        
    } catch (err) {
        console.error('some err occured', err)
    }
};