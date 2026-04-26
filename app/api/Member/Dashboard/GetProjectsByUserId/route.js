import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function handler(req,context,session) {
    try {
        const { searchParams } = new URL(req.url);
        const memberId = Number(searchParams.get("memberId"));
        const projects = await prisma.project.findMany({
            where: {
                task: {
                    some: {
                        assignedToId: memberId,
                    },
                },
            },
            select: {
                title: true,
                description: true,
                status: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "projects fetched",
            projects,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "API error" });
    }
}
export const GET = requireAuth(handler)
