import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req,context,session) {
    try {
        const { searchParams } = new URL(req.url);
        const memberId = Number(searchParams.get('memberId'))
        const organisations = await prisma.organisation.findMany({
            where:{
                projects: {
                    some: {
                        task:{
                            some:{
                                assignedToId:memberId
                            }
                        }
                    }
                }
            }
        })
        return NextResponse.json({success:true,message:"data fetched",organisations});
    } catch (error) {
        console.error("Error fetching organisations:", error);
        return NextResponse.json(
            { error: "Failed to fetch organisations" },
            { status: 500 }
        );
    }
}
export const GET = requireAuth(handler)
