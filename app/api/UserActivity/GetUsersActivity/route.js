import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function handler(req, context, session) {
    try {
        const users = await prisma.users.findMany({
            where: {
                id: { not: parseInt(session.user.id) },
                role: { not: "Admin"},
                c_name : session.user.c_name
            },
            select: {
                id: true,
                name: true,
                role: true,
                sessions: {
                    where: {
                        endedAt: {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        },
                    },
                    select: {
                        duration: true,
                        endedAt: true,
                    },
                },
            },
        });

        const formatted = users.map((user) => {
            const totalSeconds = user.sessions.reduce(
                (sum, s) => sum + s.duration, 0
            );

            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const dailyMap = {};
            days.forEach((d) => (dailyMap[d] = 0));

            user.sessions.forEach((s) => {
                const day = days[new Date(s.endedAt).getDay()];
                dailyMap[day] += Math.floor(s.duration / 60);
            });

            const weeklyChart = days.map((day) => ({
                day,
                minutes: dailyMap[day],
            }));

            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const onlineTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

            return {
                id: user.id,
                name: user.name,
                role: user.role,
                onlineTime,
                weeklyChart,
            };
        });

        return NextResponse.json({
            success: true,
            data: formatted,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "API error",
        });
    }
}

export const GET = requireAuth(handler);