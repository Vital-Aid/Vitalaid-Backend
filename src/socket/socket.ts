import http from "http";
import { Server } from "socket.io";
import path from "path";
import express, { Application } from "express";

export const app:Application = express();

export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTENT_URI,
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (userId) => {
        console.log(`User joined room: ${userId}`);
        socket.join(userId);
    });

    socket.on("joingrouproom", (userid) => {
        console.log(`User joined group room: ${userid}`);
        socket.join(userid);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

app.set("io", io); 
