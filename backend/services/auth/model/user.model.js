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

    plan:{
        type:String,
        default:"free"
    },

    credits:{
        type: Number,
        default: 100
    },
    totalCredits:{
        type: Number,
        default: 100
    },
    planExpireAt:{
        type: Date
    }




},{timestamps:true});

const User = mongoose.model("User",UserSchema);
export default User;