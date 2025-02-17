import Razorpay from "razorpay";
import { NextFunction, Request,Response } from "express";
import Donation from "../../Models/Donation";


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  });
  
  export const createOrder=async (req:Request,res:Response,next: NextFunction)=>{
   
      const { amount } = req.body;  // Amount in paisa (1 INR = 100 paisa)
  
      // Create Razorpay order
      const options = {
        amount: amount * 100,  // Convert to paisa
        currency: "INR",
        receipt: `receipt#${Math.random() * 1000}`,  // Unique receipt ID
        notes: {
          note1: "Donation for VitalAid",
        },
      };
  
      razorpay.orders.create(options, (err, order) => {
        if (err) {
            const error = err as unknown as Error;
            return res.status(500).json({ error: error.message });        }
  
        return res.status(200).json({
          orderId: order.id,
          currency: order.currency,
          amount: order.amount,
        });
      });
   
  };
  
  // Route to verify the payment after success
  export const verifyPayment=async (req:Request,res:Response):Promise<void>=>{
    const { paymentId, orderId, signature,type,userId } = req.body;
  console.log(req.body);
  
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string);
    const generatedSignature = hmac.update(orderId + "|" + paymentId).digest("hex");
  console.log('2,',generatedSignature);
  
    if (generatedSignature === signature) {
        const donation = new Donation({
            amount: req.body.amount,
            paymentId: paymentId,
            orderId: orderId,
            status: "success",
            type:type,
            user:userId
          });
          await donation.save();

      console.log('4',donation);
      
      

    res.status(200).json({
        success: true,
        message: "Payment verified successfully!",
       
    });
    return;
    } else {
       res.status(400).json({ success: false, message: "Payment verification failed!" });
       return;
    }
  };

  
 export const allDonations=async(req:Request,res:Response )=>{


  const generalTotal = await Donation.aggregate([
    { $match: { type: "general", status: "success" } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
]);

const equipmentTotal = await Donation.aggregate([
    { $match: { type: "equipment", status: "success" } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
]);

// Extract total amounts or default to 0 if no data found
const totalGeneral = generalTotal.length > 0 ? generalTotal[0].totalAmount : 0;
const totalEquipment = equipmentTotal.length > 0 ? equipmentTotal[0].totalAmount : 0;

res.status(200).json({
    success: true,
    message: "Payment verified successfully!",
    totalDonations: {
        general: totalGeneral,
        equipment: totalEquipment
    }
});
return;
 }