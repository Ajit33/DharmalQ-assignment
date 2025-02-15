import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINAI_API_KEY;
const GEMINI_EMBEDDING_URL = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`;

export class GeminiAI {
  static async getEmbedding(text: string): Promise<number[]> {
    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINAI_API_KEY in environment variables.");
    }

    try {
      const response = await axios.post(GEMINI_EMBEDDING_URL, {
        model: "models/text-embedding-004",  
        content: { parts: [{ text }] }
      });

      return response.data.embedding.values;
    } catch (error: any) {
      console.error(" Error fetching embedding:", error.response?.data || error.message);
      throw error;
    }
  }
}
