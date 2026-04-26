import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const users = await prisma.users.findMany({
            where: { c_name: session.user.cname, role: "Member" },
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 },
        );
    }
}
export const GET = requireAuth(handler);
