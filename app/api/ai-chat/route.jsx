import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { prompt } = await req.json();
    try {
        const result = await chatSession.sendMessage(prompt);

        // Use the appropriate method to extract the response
        const AIResp = typeof result.response === 'string'
            ? result.response
            : await result.response.text();

        return NextResponse.json({ response: AIResp });
    }
    catch (error) {
        console.error("AI Chat Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" });
    }
}
