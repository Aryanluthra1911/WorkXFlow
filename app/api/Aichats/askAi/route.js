import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { requireAuth } from "@/lib/auth";

async function handler(req,context,session) {
    try {
        const { searchParams } = new URL(req.url);
        const previous_chats = searchParams.get('previous_chats');
        const current_message = searchParams.get('current_message');
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: ` You are an intelligent AI assistant.
                        You will receive:
                            1. Previous conversation context (if any).
                            2. The current user message.

                        Your task:
                            - Understand the current user message using the previous context if provided.
                            - Give a short, precise, and correct answer.
                            - Avoid unnecessary explanations.
                            - Keep the response concise but complete.
                            - If the question requires steps, keep them minimal and clear.
                            - If the question is unclear, respond briefly asking for clarification.

                        Strict Rules:
                            - Do NOT include markdown.
                            - Do NOT include extra text outside JSON.
                            - Do NOT include code fences.
                            - Do NOT add explanations outside the JSON.
                            - Always return valid JSON.
                            - The JSON must contain only one key: "reply".

                        Response format (strictly follow):

                            {
                                "reply": "Your short and precise answer here."
                            }

                        Now process the following:
                            Previous Conversation:
                                ${previous_chats}

                            Current User Message:
                                ${current_message}
            `,});
            console.log(response);
        return NextResponse.json({message:"response extracted",success:true,reply:response})
    } catch (error) {
        return NextResponse.json({message:"api error",success:false})
    }
}
export const GET = requireAuth(handler)