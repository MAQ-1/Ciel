import express from "express";
const router = express.Router();
import {agent} from "../controller/agents.controller.js"

//chat agent api 
router.post("/chat",agent)












export default router;