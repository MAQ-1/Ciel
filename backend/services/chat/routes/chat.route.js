import express from "express";
import{saveMessage,getMessages,createConversation,getConversation,updateConversation} from "../controller/chat.controller.js";
const router=express.Router();

// create conversation api
router.get("/create-conversation", createConversation);

// get conversation api
router.get("/get-conversations",getConversation);

// update conversation api
router.post("/update-conversation", updateConversation);

// send message api
router.post("/save-message",saveMessage);
// get messages api
router.get("/get-messages/:conversationId",getMessages);

export default router;