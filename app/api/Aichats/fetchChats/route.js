import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth"
async function handler(req,context,session) {
    try {
        const { searchParams } = new URL(req.url);
        const convoId = parseInt(searchParams.get('convoId'));
        if (!convoId) {
            return NextResponse.json({ success: false, message: "convoId is required" });
        }
        const data = await prisma.conversation.findUnique({
            where:{
                id:convoId
            },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        }) 
        return NextResponse.json({message:"message fetched",success:true,data:data})
    } catch (error) {
        return NextResponse.json({message:"api error",success:false,error:error})
    }
}
export const GET = requireAuth(handler)