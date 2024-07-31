import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DbConnectionString);
        console.log(`Database connected successfully`);
        return connection;
    } catch (error) {
        console.log(`Error connecting to database: ${error.message}`);
    }
}


export default connectDB;