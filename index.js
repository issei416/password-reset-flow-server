import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./Routers/user.router.js"
import connectDB from "./Database/dbconfig.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.status(200).send("app is working fine"); 
})

app.use('/api/user', userRouter);

connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})