"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getmessagedusers = exports.getmsgs = exports.postchat = void 0;
const Chat_1 = __importDefault(require("../../Models/Chat"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const UserModel_1 = __importDefault(require("../../Models/UserModel"));
const postchat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const io = req.app.get("io");
    const { senderId, senderModel, receiverId, receiverModel, message } = req.body;
    if (!senderId || !senderModel || !receiverId || !receiverModel || !message) {
        return next(new CustomError_1.default("All fields are required!", 400));
    }
    const newChat = new Chat_1.default({
        senderId,
        senderModel,
        receiverId,
        receiverModel,
        message,
    });
    yield newChat.save();
    io.to(receiverId).emit("receiveMessage", {
        senderId,
        message,
    });
    res.status(201).json({
        status: true,
        message: "Message sent",
        data: newChat,
    });
});
exports.postchat = postchat;
const getmsgs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, receiverId } = req.params;
    const chats = yield Chat_1.default.find({
        $or: [
            { senderId: userId, receiverId },
            { senderId: receiverId, receiverId: userId },
        ],
    }).sort({ createdAt: 1 });
    if (!chats) {
        return next(new CustomError_1.default("there is no chats found for this parties", 404));
    }
    res.status(200).json({
        status: true,
        message: "mesage data",
        data: chats,
    });
});
exports.getmsgs = getmsgs;
const getmessagedusers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId } = req.params;
    console.log(doctorId);
    const messages = yield Chat_1.default.find({
        receiverId: doctorId,
        receiverModel: "Doctor",
    })
        .select("senderId")
        .distinct("senderId");
    // Get user details
    const users = yield UserModel_1.default.find({ _id: { $in: messages } }).select("name email");
    res.status(200).json({ success: true, data: users });
});
exports.getmessagedusers = getmessagedusers;
