import { Request, Response, NextFunction } from "express";
import Chat from "../../Models/Chat";
import CustomError from "../../utils/CustomError";
import { nextTick } from "process";
import { MWAA } from "aws-sdk";
import User from "../../Models/UserModel";

export const postchat = async (req: Request,res: Response,next: NextFunction) => {

    const { senderId, senderModel, receiverId, receiverModel, message } =req.body;

    if (!senderId || !senderModel || !receiverId || !receiverModel || !message) {
        return next(new CustomError("All fields are required!" ,400))
    }

    const newchat = new Chat({
        senderId,
        senderModel,
        receiverId,
        receiverModel,
        message,
    });

    await newchat.save();
    res.status(201).json({
        status: true,
        message: "message sent",
        data: newchat,
    });
};

export const getmsgs= async(req:Request,res:Response,next:NextFunction)=>{
    const { userId, receiverId } = req.params;

    const chats = await Chat.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    if(!chats){
        return next(new CustomError("there is no chats found for this parties",404))
    }

    res.status(200).json({
        status:true,
        message:"mesage data",
        data:chats
    });
}

export const getmessagedusers= async(req:Request,res:Response,next:NextFunction)=>{
    const { doctorId } = req.params;

    const messages = await Chat.find({ receiverId: doctorId, receiverModel: "Doctor" })
      .select("senderId")
      .distinct("senderId");

    // Get user details
    const users = await User.find({ _id: { $in: messages } }).select("name email");

    res.status(200).json({ success: true, data: users });
}