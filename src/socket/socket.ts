import http from "http";
import { Server } from "socket.io";
import express, { Application } from "express";

export const app: Application = express();
export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URI, 
        methods: ["GET", "POST"],
        
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    socket.on("joinRoom", ({ userId, role }) => {
      socket.join(userId);
      console.log(`${role} joined room: ${userId}`);
    });
  
    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      console.log(`Socket event: Message from ${senderId} to ${receiverId}: ${message}`);
    
      io.to(receiverId).emit("receiveMessage", {
        senderId,
        message,
      });
    });

    socket.on("bookToken",(data)=>{
      console.log(" New token booked:", data);
      io.emit("tokenUpdated", data)
    })

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

app.set("io", io);

