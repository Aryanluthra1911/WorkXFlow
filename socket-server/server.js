const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("user_online", (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit("online_users", Array.from(onlineUsers.keys()));
    });

    socket.on("join_chat", (chatId) => {
        socket.join(`chat_${chatId}`);
    });

    socket.on("send_message", async (data) => {
        try {
            const { chatId, senderId, content } = data;

            if (!content || !content.trim()) return;

            const message = await prisma.chatMessage.create({
                data: {
                    content: content.trim(),
                    senderId,
                    chatConversationId: chatId,
                },
            });

            io.to(`chat_${chatId}`).emit("receive_message", message);
        } catch (error) {
            console.error(error);
        }
    });

    socket.on("typing", ({ chatId, userId }) => {
        socket.to(`chat_${chatId}`).emit("typing", userId);
    });

    socket.on("stop_typing", ({ chatId }) => {
        socket.to(`chat_${chatId}`).emit("stop_typing");
    });

    socket.on("disconnect", () => {
        for (let [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId);
            }
        }

        io.emit("online_users", Array.from(onlineUsers.keys()));
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
});

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});