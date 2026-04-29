import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const projects = await prisma.project.findMany({
            where:{
                companyName : session.user.c_name
            },select: {
                id: true,
                title: true,
            },

        })

        return NextResponse.json({
            success: true,
            message: "success",
            data:projects
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "API error",
        });
    }
}

export const GET = requireAuth(handler);