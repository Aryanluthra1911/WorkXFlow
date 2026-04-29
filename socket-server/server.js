const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
    }),
);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const onlineUsers = new Map();
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // =========================
    // 🔵 USER ONLINE
    // =========================
    socket.on("user_online", (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit("online_users", Array.from(onlineUsers.keys()));
    });

    // =========================
    // 💬 JOIN CHAT
    // =========================
    socket.on("join_chat", (chatId) => {
        socket.join(`chat_${chatId}`);
        console.log(`User joined chat_${chatId}`);
    });

    // =========================
    // 📩 SEND MESSAGE
    // =========================
    socket.on("send_message", async (data) => {
        try {
            console.log("🔥 SERVER RECEIVED:", data);

            const { chatId, senderId, content } = data;

            const message = await prisma.chatMessage.create({
                data: {
                    content,
                    senderId,
                    chatConversationId: chatId,
                },
            });

            console.log("✅ SAVED IN DB:", message);

            io.to(`chat_${chatId}`).emit("receive_message", message);
        } catch (error) {
            console.error("❌ SERVER ERROR:", error);
        }
    });

    // =========================
    // ⌨️ TYPING INDICATOR
    // =========================
    socket.on("typing", ({ chatId, userId }) => {
        socket.to(`chat_${chatId}`).emit("typing", userId);
    });

    socket.on("stop_typing", ({ chatId }) => {
        socket.to(`chat_${chatId}`).emit("stop_typing");
    });

    // =========================
    // 🔴 DISCONNECT
    // =========================
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        // remove user from online list
        for (let [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId);
            }
        }

        io.emit("online_users", Array.from(onlineUsers.keys()));
    });
});

// 🚀 START SERVER
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`🔥 Socket server running on port ${PORT}`);
});
