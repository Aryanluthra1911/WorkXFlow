import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const members = await prisma.users.findMany({
            where: {
                c_name: session.user.c_name,
                role: "Member"
            }
        });

        return NextResponse.json(members);

    } catch {
        return NextResponse.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}

export const GET = requireAuth(handler);