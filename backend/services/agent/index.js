import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import router from "./route/agent.route.js";



const PORT=process.env.PORT ;

const app=express();



app.use(express.json());
app.use('/',router);

app.use((err, req, res, next) => {
    console.error(err);

    if (err.status) {
        return res.status(err.status).json(err.data);
    }

    return res.status(500).json({
        success: false,
        message: `Agent Error: ${err.message}`,
    });
});


app.get('/',(req,res)=>{
    res.status(200).json({message:"Agent service is running"});
})

app.listen(PORT,()=>{
    connectDB();
    console.log(`Agent started at ${PORT}`);
})