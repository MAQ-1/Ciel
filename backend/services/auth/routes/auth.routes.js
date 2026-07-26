import express from "express";
import { login,logout,updateUserPayment,deductCredits} from "../controller/auth.controller.js";

const router=express.Router();

// Login route
router.post("/login",login);

// logout route

router.get("/logout",logout);

router.post("/update-plan",updateUserPayment);
router.post("/deduct-credits",deductCredits);
export default router;