import mongoose from "mongoose";

const messageSchema= new mongoose.Schema({
      
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,// using anohter model in other
        ref:"Conversation",
       
    },
    role:{
        type:String,
        enum:["user","assistant"]
    },
    content:String
    

},{timestamps:true})

const Message=mongoose.model("Message",messageSchema);
export default Message;