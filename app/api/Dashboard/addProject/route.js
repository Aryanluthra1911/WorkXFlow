import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    const body = await req.json();

    const {
        title,
        deadline,
        projectManager,
        projectManagerId,
        description,
        orgId,
    } = body;


    await prisma.project.create({
        data: {
            title,
            description,
            dueDate: deadline,
            projectManager,
            projectManagerId,
            companyName: session.user.c_name,
            orgId: orgId,
        },
    });

    return NextResponse.json({
        success: true,
        message: "project created",
    });
}

export const POST = requireAuth(handler);