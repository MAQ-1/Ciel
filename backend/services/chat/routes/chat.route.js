import express from "express";
import{saveMessage,getMessages,createConversation,getConversation,updateConversation} from "../controller/chat.controller.js";
const router=express.Router();

// create conversation api
router.get("/conversations", getConversation);

// get conversation api
router.get("/get-conversations",getConversation);

// update conversation api
router.post("/update-conversations", updateConversation);

// send message api
router.post("/messages",saveMessage);
// get messages api
router.get("/messages/:conversationId",getMessages);

export default router;