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
    }),
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
        onlineUsers.set(userId, {
            socketId: socket.id,
            onlineAt: new Date(),
        });
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

            io.to(`chat_${chatId}`).emit("latest_message_update", {
                chatId,
                message,
            });
        
            const participants = await prisma.chatParticipants.findMany({
                where: { chatConversationId: chatId },
                select: { userId: true },
            });
            const receiverId = participants.find(
                (p) => p.userId !== senderId,
            )?.userId;
            const receiverData = onlineUsers.get(receiverId);
            if (receiverData) {
                io.to(receiverData.socketId).emit("new_unread", {
                    chatId,
                    senderId,
                });
            }
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

    socket.on("disconnect", async () => {
        for (let [userId, data] of onlineUsers.entries()) {
            if (data.socketId === socket.id) {
                const durationMs = new Date() - new Date(data.onlineAt);
                const durationSeconds = Math.floor(durationMs / 1000);

                await prisma.userSession.create({
                    data: {
                        userId,
                        duration: durationSeconds,
                        endedAt: new Date(),
                    },
                });

                onlineUsers.delete(userId);
                break;
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
