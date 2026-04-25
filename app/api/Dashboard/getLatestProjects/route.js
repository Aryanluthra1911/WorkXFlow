import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const projects = await prisma.project.findMany({
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
            data: projects
        });

    } catch (err) {
        return NextResponse.json({
            success: false,
            message: "api error"
        });
    }
}

export const GET = requireAuth(handler);