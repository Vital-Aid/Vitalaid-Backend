import Razorpay from "razorpay";
import { NextFunction, Request, Response } from "express";
import Donation from "../../Models/Donation";
import axios from "axios";
import CustomError from "../../utils/CustomError";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt#${Math.random() * 1000}`,
    notes: {
      note1: "Donation for VitalAid",
    },
  };

  razorpay.orders.create(options, (err, order) => {
    if (err) {
      const error = err as unknown as Error;
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  });
};

export const verifyPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { paymentId, orderId, signature, type, userId } = req.body;
  console.log(req.body);

  const crypto = require("crypto");
  const hmac = crypto.createHmac(
    "sha256",
    process.env.RAZORPAY_KEY_SECRET as string
  );
  const generatedSignature = hmac
    .update(orderId + "|" + paymentId)
    .digest("hex");
  console.log("2,", generatedSignature);

  if (generatedSignature === signature) {
    const donation = new Donation({
      amount: req.body.amount,
      paymentId: paymentId,
      orderId: orderId,
      status: "success",
      type: type,
      user: userId,
    });
    await donation.save();

    console.log("4", donation);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully!",
    });
    return;
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed!" });
    return;
  }
};

export const allDonations = async (req: Request, res: Response) => {
  const generalTotal = await Donation.aggregate([
    { $match: { type: "general", status: "success" } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
  ]);

  const equipmentTotal = await Donation.aggregate([
    { $match: { type: "equipment", status: "success" } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
  ]);

  const totalGeneral =
    generalTotal.length > 0 ? generalTotal[0].totalAmount : 0;
  const totalEquipment =
    equipmentTotal.length > 0 ? equipmentTotal[0].totalAmount : 0;


  const totalDonation = totalGeneral + totalEquipment;

  res.status(200).json({
    success: true,
    message: "Payment verified successfully!",
    totalDonations: {
      general: totalGeneral,
      equipment: totalEquipment,
      total: totalDonation  
    },
  });
};

export const getAllDonations = async (req: Request, res: Response,next:NextFunction) => {
  
  const donations = await Donation.find()
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });
    if(!donations){
      return next(new CustomError("deatils not found",404))
    }

  res.status(200).json({
    success: true,
    data: donations,
  });


};

export const getUserReceipt = async (req: Request, res: Response,next:NextFunction) => {
  const { userId } = req.params;
  const donation = await Donation.findOne({ user: userId }) .populate("user", "name email phone").sort({ date: -1 });

  if(!donation){
    return next(new CustomError("deatils not found",404))
  }

  res.status(200).json({
    success: true,
    data :donation,
  });

};

export const getAllDonationsById =async(req: Request, res: Response,next:NextFunction)=>{
const { userId } = req.params;
const donation = await Donation.find({ user: userId }) .populate("user", "name email phone").sort({ date: -1 });
if(!donation){
  return next(new CustomError("deatils not found",404))
}
res.status(200).json({
  success: true,
  data :donation,
});

}