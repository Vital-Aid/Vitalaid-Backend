import { Request, Response, NextFunction } from "express";
import Chat from "../../Models/Chat";
import CustomError from "../../utils/CustomError";
import User from "../../Models/UserModel";

interface Message {
    senderId: string;
    senderModel: "User" | "Doctor";
    receiverId: string;
    receiverModel: "User" | "Doctor";
    message: string;
}
 


export const postchat = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const io = req.app.get("io");
    const { senderId, senderModel, receiverId, receiverModel, message } = req.body;
    
    if (!senderId || !senderModel || !receiverId || !receiverModel || !message) {
        return next(new CustomError("All fields are required!", 400));
    }
    
    const newChat = new Chat({
        senderId,
        senderModel,
        receiverId,
        receiverModel,
        message,
    });
    
    await newChat.save();
    
   
    io.to(receiverId).emit("receiveMessage", {
        senderId,
        message,
    });
    
    res.status(201).json({
        status: true,
        message: "Message sent",
        data: newChat,
    });
};


export const getmsgs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId, receiverId } = req.params;

    const chats = await Chat.find({
        $or: [
            { senderId: userId, receiverId },
            { senderId: receiverId, receiverId: userId },
        ],
    }).sort({ createdAt: 1 });

    if (!chats) {
        return next(
            new CustomError("there is no chats found for this parties", 404)
        );
    }

    res.status(200).json({
        status: true,
        message: "mesage data",
        data: chats,
    });
};

export const getmessagedusers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    
    const { doctorId } = req.params;
    console.log(doctorId);

    const messages = await Chat.find({
        receiverId: doctorId,
        receiverModel: "Doctor",
    })
        .select("senderId")
        .distinct("senderId");

    // Get user details
    const users = await User.find({ _id: { $in: messages } }).select(
        "name email"
    );

    res.status(200).json({ success: true, data: users });
};
