import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth} from "@/lib/auth"
async function handler() {
    try{
        const now = new Date();
        const result = await prisma.conversation.deleteMany({
            where: {
                expiresAt: {
                    lt: now,
                },
            },
        });
        if (result.count === 0) {
            return NextResponse.json({
                success: true,
                message: "No expired chats found"
            });
        }
        return NextResponse.json({message:"deleted expired chats",success:true})
    }catch(err){
        return NextResponse.json({message:"api error",success:false,error:err.message})
    }
}
export const DELETE = requireAuth(handler);