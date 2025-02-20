import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 🔥 Fix: Ensure request body is available before parsing JSON
    const rawBody = await req.text(); 
    if (!rawBody) {
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
    }

    const { prompt } = JSON.parse(rawBody); // ✅ Now safely parsing JSON

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is missing" }, { status: 400 });
    }

    const result = await GenAiCode.sendMessage(prompt);

    if (!result?.response) {
      throw new Error("Invalid AI response structure");
    }

    const respText = await result.response.text();

    try {
      const parsedResponse = JSON.parse(respText);
      return NextResponse.json(parsedResponse);
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError);
      return NextResponse.json({ error: "Invalid JSON format from AI" });
    }
  } catch (error) {
    console.error("Error in AI Chat:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
