import express from "express";
import { login,logout } from "../controller/auth.controller.js";

const router=express.Router();

// Login route
router.post("/login",login);

// logout route

router.get("/logout",logout);

export default router;