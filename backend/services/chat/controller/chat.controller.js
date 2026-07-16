import Conversation from "../model/conversation.model.js";
import Message from "../model/message.model.js";

// Conversation create function

export const createConversation=async(req,res)=>{
    try{
      
        // taking user id from header
      const userId=req.headers["x-user-id"]
      console.log(userId);
      
    //   create conversation in db
      const conversation = await Conversation.create({
        userId:userId,
      })
    
      return res.status(201).json({message:"conversation created",conversation})
    }catch(error){
        return res.status(500).json({message:"createConversation error",error:error.message})
    }
}

// coversation get function

export const getConversation=async(req,res)=>{
try{
      
        // taking user id from header
      const userId=req.headers["x-user-id"]
      console.log(userId);
      
    // finding all conversation in db
      const conversations = await Conversation.find({
        userId:userId,
      }).sort({updatedAt:-1}) // sorting by updatedAt in descending order to get the latest conversation
    
      return res.status(200).json({message:"conversation found",conversations})
    }catch(error){
        return res.status(500).json({message:"createConversation error",error:error.message})
    }
}



// conversation update function


export const updateConversation=async(req,res)=>{
    try{
          const {id,title}=req.body;

          const update= await Conversation.findByIdAndUpdate(id,{
            title
          });

          return res.status(200).json({message:"conversation updated",update})
           
    }catch(error){
       return res.status(500).json({message:"updateConversation error",error:error.message} )
    }
}



// save message function

export const saveMessage=async(req,res)=>{
    try{ 
        // taking id,role,and content from body
        const{conversationId,role,content}=req.body;
       
        //just checking if all data is present or not
        if(!conversationId || !role || !content){
            return res.status(400).json({message:"something gone wrong while fetching data for message"})
        }
      
        // save the message in db
        const message=await Message.create({
            conversationId,
            role,
            content
        })

        return res.status(201).json({message:"message saved",message})

    }catch(error){
     return res.status(500).json({message:"saveMessage error",error:error.message}) 
    }
}

// Get messages function

export const getMessages=async(req,res)=>{
    try{ 
        // taking conversation id from params
        const {conversationId}=req.params;
       
        //just checking if conversation id is present or not
        if(!conversationId){
            return res.status(400).json({message:"conversation id is required"})
        }
      
        // find the messages in db
        const messages=await Message.find({
            conversationId
        }).sort({updatedAt:1}) // sorting by updatedAt in ascending order to get the messages in order

        return res.status(200).json({message:"messages found",messages})

    }catch(error){
     return res.status(500).json({message:"getMessages error",error:error.message}) 
    }
}