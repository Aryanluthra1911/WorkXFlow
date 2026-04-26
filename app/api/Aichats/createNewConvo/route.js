import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req,context,session) {
    try{
        const conversation = await prisma.conversation.create({
            data:{
                email:session.user.email,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000),
            }
        })
        return NextResponse.json({message:'created new convo id',success:true,conversationId:conversation.id})
    }catch(err){
        return NextResponse.json({message:"api error",success:false,error:err})
    }
}
export const POST = requireAuth(handler)