import redis from "../../shared/redis/redis.js";

// retrieving userd data current user
const protect = async(req,res,next)=>{
  try{ 
        
       const sessionId=req.cookies?.session;
        
       
       if(!sessionId){
        return res.status(401).json({message:"Unauthorized"})
       }
      
       // Session Id milgyi ab redis se session nikal lo
      const session= await redis.get(`session:${sessionId}`)
      
      if(!session){
        return res.status(401).json({message:"session expired"})
      }
      
      //session milgya ab json se parse krdo warna string mai value milegi
      req.user=JSON.parse(session)
      next();
       
  }catch(error){
    return res.status(500).json({message:"protect error",error:error.message})

  }
}

export default protect;