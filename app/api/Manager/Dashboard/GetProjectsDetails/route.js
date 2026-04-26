import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";


async function handler(req,conetxt,session){
    try{
        const { searchParams } = new URL(req.url);
        const managedById = searchParams.get('managedById');
        const projects = await prisma.project.findMany({
            where: {projectManagerId:Number(managedById)},
            include:{
                organisation: {
                    select: {
                        companyName: true
                    }
                },
                _count:{
                    select:{
                        task:true,
                    },
                },
                task:{
                    where:{
                        status:"COMPLETED"
                    },
                    select:{
                        id:true,
                    },
                },
            },
        });
        return NextResponse.json({
            success: true,
            data: projects
        });
    }catch(err){
        return NextResponse.json({message:"api error",success:false,error:err})
    }
}
export const GET = requireAuth(handler)