import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  // Unofficial/undocumented in some versions, but standard REST exists:
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    console.log(data.models.map(m => m.name));
  } catch (e) {
    console.error(e);
  }
}
run();
