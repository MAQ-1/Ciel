import express from "express";
const router = express.Router();
import {agent, agentStream} from "../controller/agents.controller.js"
import multer from "../config/multer.js"
//chat agent api 
router.post("/chat",multer.single("file"),agent)
router.post("/chat/stream", agentStream)












export default router;