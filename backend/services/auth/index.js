import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import router from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";



const PORT=process.env.PORT ;
const app=express();
app.use(cookieParser());
app.use(express.json());
app.use("/",router);



app.get('/',(req,res)=>{
  res.json({message:"Auth service is running"});
})

app.listen(PORT,()=>{
    connectDB();
    console.log(`Auth started at ${PORT}`);
})