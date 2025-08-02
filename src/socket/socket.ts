import http from "http";
import { Server } from "socket.io";
import express, { Application } from "express";

export const app: Application = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ userId, role }) => {
    socket.join(userId);
    console.log(`${role} joined room: ${userId}`);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    io.to(receiverId).emit("receiveMessage", {
      senderId,
      message,
    });
  });

  socket.on("bookToken", (data) => {
    io.emit("tokenUpdated", data);
  });
  socket.on("otpVerification", (otp) => {
    io.emit("otpVerified");
  });

  socket.on("disconnect", () => {
    console.log("User has left");
  });
});

app.set("io", io);
