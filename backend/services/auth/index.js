import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/auth.routes.js";

dotenv.config();

const PORT=process.env.PORT ;
const app=express();
app.use(express.json());
app.use("/",router);



app.get('/',(req,res)=>{
  res.json({message:"Auth service is running"});
})

app.listen(PORT,()=>{
    connectDB();
    console.log(`Auth started at ${PORT}`);
})