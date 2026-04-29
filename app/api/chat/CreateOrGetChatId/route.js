import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const { userA, userB } = await req.json();
        let chat = await prisma.chatConversation.findFirst({
            where: {
                AND: [
                    {
                        participants: {
                            some: { userId: userA },
                        },
                    },
                    {
                        participants: {
                            some: { userId: userB },
                        },
                    },
                    {
                        participants: {
                            every: {
                                userId: { in: [userA, userB] },
                            },
                        },
                    },
                ],
            },
        });
        if (!chat) {
            chat = await prisma.chatConversation.create({
                data: {
                    participants: {
                        create: [{ userId: userA }, { userId: userB }],
                    },
                },
            });
        }
        return NextResponse.json({
            success: true,
            message: "success",
            data:chat
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "API error",
        });
    }
}

export const POST = requireAuth(handler);
