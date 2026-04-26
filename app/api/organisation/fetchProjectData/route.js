import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req,context,session) {
    try {
        const { searchParams } = new URL(req.url);
        const projectId = Number(searchParams.get('projectId'))
        const project = await prisma.project.findUnique({
            where:{id:projectId},
            include:{
                task:true
            }
        }) 
        return NextResponse.json({success:true,data:project})
    } catch (error) {
        throw error
    }
}
export const GET = requireAuth(handler)