import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req,context,session) {
    try {
        const { taskId, status } = await req.json();
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { status }
        });
        return NextResponse.json({ success: true, data: updatedTask });
    }catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
export const PATCH = requireAuth(handler)