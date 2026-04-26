import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req,context,session) {
    try {
        const { searchParams } = new URL(req.url);
        const memberId = Number(searchParams.get('memberId'));
        const statusCount = await prisma.task.groupBy({
            by:["status"],
            where:{
                assignedToId:memberId
            },
            _count:{
                status:true
            }

        }) 
        return NextResponse.json({success:true,message:"task fetched",statusCount})
    } catch (error) {
        console.log(error);
        return NextResponse.json({success:false,message:"API error"})
    }
}
export const GET = requireAuth(handler)