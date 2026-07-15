import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const PORT=process.env.PORT ;

const app=express();

app.get('/',(req,res)=>{
    res.status(200).json({message:"Agent service is running"});
})

app.listen(PORT,()=>{
    connectDB();
    console.log(`Agent started at ${PORT}`);
})