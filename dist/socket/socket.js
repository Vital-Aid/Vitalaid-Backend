"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.server = http_1.default.createServer(exports.app);
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: process.env.FRONTEND_URI,
        methods: ["GET", "POST", "PUT"],
        credentials: true,
    },
});
exports.io.on("connection", (socket) => {
    socket.on("joinRoom", ({ userId, role }) => {
        socket.join(userId);
        console.log(`${role} joined room: ${userId}`);
    });
    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        exports.io.to(receiverId).emit("receiveMessage", {
            senderId,
            message,
        });
    });
    socket.on("bookToken", (data) => {
        exports.io.emit("tokenUpdated", data);
    });
    socket.on("otpVerification", (otp) => {
        exports.io.emit("otpVerified");
    });
    socket.on("disconnect", () => {
        console.log("User has left");
    });
});
exports.app.set("io", exports.io);
