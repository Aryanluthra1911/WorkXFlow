import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const users = await prisma.users.findMany({
            where: { 
                c_name: session.user.c_name ,
                NOT:{
                    email:session.user.email
                },
            },
            
            select: {
                id: true,
                name: true,
                role:true
            },
        });
        return NextResponse.json({
            success: true,
            message: "user fetched",
            data: users,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "API error" });
    }
}

export const GET = requireAuth(handler);
