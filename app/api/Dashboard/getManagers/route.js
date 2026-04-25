import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const manager = await prisma.users.findMany({
            where: {
                c_name: session.user.c_name,
                role: "Manager"
            }
        });

        return NextResponse.json(manager);

    } catch {
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}

export const GET = requireAuth(handler);