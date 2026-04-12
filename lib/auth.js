import { getServerSession } from "next-auth";

export function requireAuth(handler) {
    return async (req) => {
        const session = await getServerSession();

        if (!session) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized" }),
                { status: 401 }
            );
        }

        return handler(req, session);
    };
}