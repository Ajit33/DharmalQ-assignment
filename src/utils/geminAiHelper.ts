import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINAI_API_KEY;
const GEMINI_CHAT_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
const GEMINI_EMBEDDING_URL = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;

export async function generateGeminiResponse(user_message: string, context?: string | "embedding"): Promise<any> {
    if (!GEMINI_API_KEY) throw new Error(" Missing GEMINAI_API_KEY in environment variables.");

    try {
        if (context === "embedding") {
            //  Generate embedding for vector search
            const response = await axios.post(GEMINI_EMBEDDING_URL, {
                model: "models/text-embedding-004",
                content: { parts: [{ text: user_message }] }
            });

            return response.data.embedding?.values || [];
        } else {
            //  Generate response using Gemini AI with context
            const response = await axios.post(GEMINI_CHAT_URL, {
                contents: [
                    { role: "user", parts: [{ text: context ? `${context}\n\nUser: ${user_message}` : user_message }] }
                ]
            });

            console.log(" Gemini AI Raw Response:", JSON.stringify(response.data, null, 2));

            //  FIX: Ensure response structure exists before accessing it
            if (
                response.data &&
                response.data.candidates &&
                response.data.candidates[0] &&
                response.data.candidates[0].content &&
                response.data.candidates[0].content.parts &&
                response.data.candidates[0].content.parts[0]
            ) {
                return response.data.candidates[0].content.parts[0].text;
            } else {
                console.error(" Unexpected AI Response Format:", response.data);
                return "I couldn't understand that. Can you ask in another way?";
            }
        }
    } catch (error: any) {
        console.error(" Error generating Gemini AI response:", error.response?.data || error.message);
        throw error;
    }
}

