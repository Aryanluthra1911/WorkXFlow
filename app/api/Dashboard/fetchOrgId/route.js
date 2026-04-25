import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const body = await req.json();
        const { org_name } = body;

        const organisation = await prisma.organisation.upsert({
            where: { organisationName: org_name },
            update: {},
            create: {
                organisationName: org_name,
                companyName: session.user.c_name
            }
        });

        return NextResponse.json({
            success: true,
            orgId: organisation.id
        });

    } catch (error) {
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}

export const POST = requireAuth(handler);