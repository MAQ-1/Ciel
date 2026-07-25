import {PLANS} from '../config/Plans.js';
import razorpay from '../config/razorpay.js';
import axios from 'axios';
import Payment from '../model/payment.model.js';
import crypto from 'crypto';

export const createOrder = async (req, res)=>{
try{
     const {plan} = req.body;
     const userId = req.headers['x-user-id'];

     const selectedPlan = PLANS[plan];

     if(!selectedPlan){
        return res.status(400).json({error:"Invalid plan selected"});
     }
     
    //  create order using Razorpay
     const order= await razorpay.orders.create({
        amount:selectedPlan.amount * 100, // Amount in paise
        currency:"INR",
        receipt:`receipt-${Date.now()}`,
        
     })
 
    //  save order details in database
    await Payment.create({
        userId,
        orderId:order.id,
        amount:selectedPlan.amount,
        credits:selectedPlan.credits,
        plan:selectedPlan.id,
        currency:order.currency,
        status:"created"
    })

    return res.status(200).json({order,plan:selectedPlan});
     

}catch(err){
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });   

}
}

// verify payment and update user credits

export const verifyPayment = async (req, res)=>{
    try{
           const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
           
        //   crypto to generate signature and compare with razorpay_signature
           const generateSignature = crypto
                                     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                                     .digest('hex');


            
        if(generateSignature !== razorpay_signature){
            return res.status(400).json({error:"payment verification failed"});
        }
        
        const payment = await Payment.findOne({orderId:razorpay_order_id});
        if(!payment){
            return res.status(404).json({error:"Payment not found"});
        }

        payment.status = "paid";
        payment.paymentId = razorpay_payment_id;
        await payment.save();
        
        const {data}=  await axios.post(`${process.env.AUTH_SERVICE_URL}/update-plan`,{
            userId:payment.userId,
            plan:payment.plan,
            credits:payment.credits
        })
        console.log("User credits updated:", data);

        return res.status(200).json({message:"Payment verified and user credits updated successfully"});
    }catch(err){
        return res.status(500).json({error:"verify payment error",details:err.message});
    }
}