import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function handler(req,context,session) {
    try {
        const { searchParams } = new URL(req.url);
        const memberId = Number(searchParams.get("memberId"));
        const tasks = await prisma.task.findMany({
            where: { assignedToId: memberId },
            select:{
                title:true,
                description:true,
                status:true
            }
        });
        return NextResponse.json({
            success: true,
            message: "tasks fetched",
            tasks,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "API error" });
    }
}
export const GET = requireAuth(handler)
