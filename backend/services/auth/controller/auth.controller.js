import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../model/user.model.js";
import redis from "../../../shared/redis/redis.js";

// LOGIN CONTROLLER
export const login = async (req, res) => {
    try {

        const { token } = req.body;

        // getting token and verifying it
        const decode = await getAuth(app).verifyIdToken(token)

        // checking through uid from firebase
        let user = await User.findOne({ firebaseUID: decode.uid })

        // now check if user is present or not 
        if (!user) {
            // creating the user
            user = await User.create({
                firebaseUID: decode.uid,
                name: decode.name,
                email: decode.email,
                avatar: decode.picture
            })
        }

        //storing session id in cookie for authentication
        const sessionId = crypto.randomUUID();
        await redis.set(`suser-session:${user?._id}`,
            sessionId
            , "EX", 7 * 24 * 60 * 60) // expireing in 7 days

        // using redis to store session id and user id for authentication
        // by passing key and value of user data to store in redis
        await redis.set(`session:${sessionId}`,
            JSON.stringify({
                userId: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpireAt: user.planExpireAt
            }), "EX", 7 * 24 * 60 * 60  // expireing in 7 days
        );


        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ message: "Login successful", user })

    } catch (error) {
        return res.status(500).json({ message: "login error", error: error.message })
    }
}


// Logut controller

export const logout = async (req, res) => {
    try {

        // console.log("1. Full cookies object:", req.cookies);
        // console.log("2. Session cookie value:", req.cookies?.session);
        // console.log("3. All headers:", req.headers);
        // console.log("4. Cookie header raw:", req.headers.cookie);
        const sessionId = req.cookies.session;

        //     console.log("Cookies:", req.cookies);
        //    console.log("Session ID:", req.cookies?.session);
        // delete from redis
        await redis.del(`session:${sessionId}`);

        // clear cookie
        res.clearCookie("session", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        console.log("Cookies:", req.cookies);
        console.log("Session ID:", req.cookies?.session);

        return res.status(200).json({ message: "Logout successful" })

    } catch (error) {
        return res.status(500).json({ message: "logout error", error: error.message })
    }
}

// credit manage

export const updateUserPayment = async (req, res) => {
    try {
        const { plan, credits, userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        user.plan = plan;
        user.credits += credits;
        user.totalCredits += credits;
        user.planExpireAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        await user.save();

        //  
        const sessionId = await redis.get(`suser-session:${user?._id}`)
        await redis.set(`session:${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpireAt: user.planExpireAt
        }), "EX", 7 * 24 * 60 * 60  // expireing in 7 days);
        )

        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ message: "update user payment error", error: error.message })
    }
}

// credit deduct 

export const deductCredits = async (req, res) => {
    try {
        const { userId, agent } = req.body;

        const COST = {
            chat: 1,
            search: 5,
            coding: 10,
            pdf: 10,
            ppt: 10,
            vision: 10,
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const requiredCredits = COST[agent] || 1;
        if (user.credits < requiredCredits) {
            return res.status(400).json({ message: "Insufficient credits" })
        }
        user.credits -= requiredCredits;
        await user.save();

        const sessionId = await redis.get(`suser-session:${user?._id}`)
        await redis.set(`session:${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpireAt: user.planExpireAt
        }), "EX", 7 * 24 * 60 * 60  // expireing in 7 days);
        )

        return res.status(200).json({ success: true,credits:user.credits })

    } catch (error) {
        return res.status(500).json({ message: "deduct credits error", error: error.message })
    }
}