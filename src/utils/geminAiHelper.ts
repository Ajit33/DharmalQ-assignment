import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINAI_API_KEY || ""; // Ensure API key is in .env
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateGeminiResponse(character: string, userMessage: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        You are "${character}", a famous movie character. Respond in their signature tone and personality.
        The response must:
        - Be short (one or two sentences maximum).
        - Sound exactly like the character.
        - Avoid unnecessary phrases like "aur aap kya jaana chahte ho?".
        - Feel like a real movie dialogue.

        User: ${userMessage}
        ${character}:`;

        const result = await model.generateContent(prompt);
        const response = result.response.text().trim();

        // Extract only the first sentence and remove unnecessary parts
        const cleanedResponse = response.split("\n")[0]
            .replace(/aur aap .*/i, '') // Removes "aur aap kya jaana chahte ho?" or similar
            .trim();

        return cleanedResponse || "I don't have a response for that.";
    } catch (error) {
        console.error("Gemini AI Response Error:", error);
        return "I don't have a response for that.";
    }
}