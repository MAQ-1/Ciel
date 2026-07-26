import express from "express";
const router = express.Router();
import {agent} from "../controller/agents.controller.js"
import multer from "../config/multer.js"
//chat agent api 
router.post("/chat",multer.single("file"),agent)












export default router;