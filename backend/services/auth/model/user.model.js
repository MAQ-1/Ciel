import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
     
    firebaseUID:{
        type:String,
        unique:true,
    },
    name:String,
    email:{
        type:String,
        unique:true,
    },
    avatar:String,
},{timestamps:true});

const User = mongoose.model("User",UserSchema);
export default User;