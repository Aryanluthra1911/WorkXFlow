import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        return NextResponse.json({
            success: true,
            status: 100,
            message: "data fetched",
            data: user
        });

    } catch (err) {
        return NextResponse.json({
            success: false,
            status: 400,
            message: "api error"
        });
    }
}

export const GET = requireAuth(handler);