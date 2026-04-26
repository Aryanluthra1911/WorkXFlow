import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req,context,session) {
    try {
        const { searchParams } = new URL(req.url);
        const orgId = Number(searchParams.get('orgId'));
        const orgData = await prisma.organisation.findUnique({
            where: { id: orgId },
            include: {
                projects: {
                    include:{
                        task:true
                    }
                }
            }
        });
        if (!orgData) {
            return NextResponse.json({ success: false, message: "Organisation not found" });
        }

        const totalProjects = await prisma.project.count({
            where: { orgId : orgId }
        });

        const statusCounts = await prisma.project.groupBy({
            by: ["status"],
            where: { orgId : orgId },
            _count: {
                status: true
            }
        });

        const statuses = {
            PENDING: 0,
            ACTIVE: 0,
            COMPLETED: 0,
            ON_HOLD: 0,
            CANCELLED: 0
        };

        statusCounts.forEach(item => {
            statuses[item.status] = item._count.status;
        });

        return NextResponse.json({
            success: true,
            data: orgData,
            totalProjects,
            statusSummary: statuses
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            {success:false, error: "Failed to fetch projects" }
        );
    }
}
export const GET = requireAuth(handler)
