import { getAuth } from "firebase-admin/auth";
import {app} from "../config/firebase.js";
import User from "../model/user.model.js";
import redis from "../../../shared/redis/redis.js";

// LOGIN CONTROLLER
export const login = async (req, res) => {
    try{
         
        const {token} =req.body;

        // getting token and verifying it
        const decode= await getAuth(app).verifyIdToken(token)

        // checking through uid from firebase
        let user= await User.findOne({firebaseUID:decode.uid})

        // now check if user is present or not 
         if(!user){
            // creating the user
            user = await User.create({
                firebaseUID:decode.uid,
                name:decode.name,
                email:decode.email,
                avatar:decode.picture
            })
         }
    
   //storing session id in cookie for authentication
    const sessionId=crypto.randomUUID();
    
    // using redis to store session id and user id for authentication
     // by passing key and value of user data to store in redis
    await redis.set(`session:${sessionId}`,
        JSON.stringify({
            userId:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar
        }),"EX",7*24*60*60  // expireing in 7 days
    );


    res.cookie("session",sessionId,{
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })
    
    return res.status(200).json({message:"Login successful",user})

    }catch(error){
         return res.status(500).json({message:"login error",error:error.message})
    }
}


// Logut controller

export const logout =async(req,res)=>{
    try{

        // console.log("1. Full cookies object:", req.cookies);
        // console.log("2. Session cookie value:", req.cookies?.session);
        // console.log("3. All headers:", req.headers);
        // console.log("4. Cookie header raw:", req.headers.cookie);
        const sessionId=req.cookies.session;
          
        console.log("Cookies:", req.cookies);
       console.log("Session ID:", req.cookies?.session);
        // delete from redis
        await redis.del(`session:${sessionId}`);

        // clear cookie
        res.clearCookie("session", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        console.log("Cookies:", req.cookies);
        console.log("Session ID:", req.cookies?.session);

        return res.status(200).json({message:"Logout successful"})

    }catch(error){
     return res.status(500).json({message:"logout error",error:error.message})
    }
}