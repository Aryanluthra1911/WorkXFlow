import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const convo = await prisma.conversation.findFirst({
            where: {
                email: session.user.email,
            },
            select: {
                id: true,
                expiresAt: true,
            },
        });
        if (!convo) {
            return NextResponse.json({
                message: "No conversation found",
                success: false,
            });
        }

        if (convo.expiresAt < new Date()) {
            return NextResponse.json({
                message: "Conversation Expired",
                success: false,
            });
        }
        if (convo.expiresAt < new Date()) {
            return NextResponse.json({
                message: "Conversation Expired",
                success: false,
            });
        }
        return NextResponse.json({
            message: "fetched convo id",
            success: true,
            data: convo,
        });
    } catch (err) {
        return NextResponse.json({
            message: "api error",
            success: false,
            error: err,
        });
    }
}
export const GET = requireAuth(handler);
