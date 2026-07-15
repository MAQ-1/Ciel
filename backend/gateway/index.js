import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import getCurrentUser from "./controller/user.controller.js";
import proxyWithHeader from "./utils/proxywithHeader.js";
dotenv.config();

const PORT=process.env.PORT ;
const app=express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

app.use(cookieParser());


//AUTH server
app.use('/api/auth',proxy(
    process.env.AUTH_SERVICE_URL, 
));

//CHAT server with proxywith header
app.use('/api/chat',protect,proxyWithHeader(
    process.env.CHAT_SERVICE_URL
));

// Agent server
app.use('/api/agent',protect,proxy(
    process.env.AGENT_SERVICE_URL
));

// get CUrrent user
app.get('/api/me',protect,getCurrentUser);




app.get('/',(req,res)=>{
  res.json({message:"Gateway is running"});
})

app.listen(PORT,()=>{
    console.log(`Gateway started at ${PORT}`);
})
