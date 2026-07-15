import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/chat.route.js";
dotenv.config();

const PORT=process.env.PORT ;
const app=express();

app.use(express.json());
app.use("/",router);



app.get('/',(req,res)=>{
    res.status(200).json({message:"Chat service is running"});
})

app.listen(PORT,()=>{
    connectDB();
    console.log(`Chat started at ${PORT}`);
})