import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const { searchParams } = new URL(req.url);
        const chatId = parseInt(searchParams.get("chatId"));

        const message = await prisma.chatMessage.findMany({
            where: { chatConversationId: chatId },
            orderBy: { createdAt: "asc" },
        });
        return NextResponse.json({
            success: true,
            message: "chats fetched",
            data: message,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "api error" });
    }
}

export const GET = requireAuth(handler);
