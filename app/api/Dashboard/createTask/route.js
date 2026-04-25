import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const body = await req.json();
        const {
            title,
            description,
            assignedToId,
            assignedTo,
            dueDate,
            projectId
        } = body;
        await prisma.task.create({
            data: {
                title,
                description,
                assignedTo,
                assignedToId,
                dueDate,
                projectId,
                companyName: session.user.c_name
            }
        });
        return NextResponse.json({
            success: true,
            message: "Task Created"
        });
    } catch (err) {
        console.error("ADD TASK ERROR", err);
        return NextResponse.json({
            success: false,
            message: "API failed"
        });
    }
}

export const POST = requireAuth(handler);