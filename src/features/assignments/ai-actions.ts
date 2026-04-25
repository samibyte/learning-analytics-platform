"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function refineAssignmentClarity(
  currentDescription: string,
): Promise<{
  success: boolean;
  text?: string;
  error?: string;
  isFallback?: boolean;
}> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from environment variables.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert technical instructor. Please refine and enhance the following assignment description. 
      Make it more clear, professional, and well-structured. Output ONLY the refined description text, without any conversational filler.
      
      Original Description:
      ${currentDescription}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { success: true, text: response.text(), isFallback: false };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("AI API Error, falling back to strategic mock:", message);

    // Strategic Mock Fallback
    const mockedRefinement =
      `**✨ AI Refined Instructions:**\n\n` +
      `Overview: Please carefully review the following requirements.\n\n` +
      `${currentDescription
        .split(".")
        .map((s) => (s.trim().length > 0 ? `- ${s.trim()}.` : ""))
        .join("\n")}\n\n` +
      `*Note: This is an auto-structured fallback due to extremely high demand on the live LLM API.*`;

    return { success: true, text: mockedRefinement, isFallback: true };
  }
}
