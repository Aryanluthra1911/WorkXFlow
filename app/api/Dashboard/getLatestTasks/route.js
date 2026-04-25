import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                companyName: session.user.c_name
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 2
        });

        return NextResponse.json({
            success: true,
            data: tasks || []
        });

    } catch (err) {
        console.error("ERROR", err);

        return NextResponse.json(
            {
                success: false,
                message: "Server crashed"
            },
            { status: 500 }
        );
    }
}

export const GET = requireAuth(handler);