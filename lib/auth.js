import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export function requireAuth(handler) {
    return async (req, context) => {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized" }),
                { status: 401 }
            );
        }

        return handler(req, context, session);
    };
}