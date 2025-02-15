import { Request, Response } from "express";
import prisma from "../db/PrismaClient";
import { generateGeminiResponse } from "../utils/geminAiHelper";
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";

dotenv.config();
const chroma = new ChromaClient({ path: process.env.CHROMA_DB_PATH! });

export const getCharacterResponse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { character, user_message } = req.body;

        if (!character || !user_message) {
            res.status(400).json({ error: "Character and message are required." });
            return;
        }

        // Ensure pg_trgm is enabled before making queries
        await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

        // 1️⃣ Find character in the database
        const characterEntry = await prisma.character.findUnique({
            where: { name: character }
        });

        if (!characterEntry) {
            console.log(`Character '${character}' not found, using Gemini AI.`);
            const aiResponse = await generateGeminiResponse(character, user_message);
            res.json({ response: aiResponse, source: "genAi", context: null });
            return;
        }

        // 2️⃣ Find most relevant dialogue using ChromaDB (Vector Search)
        const queryEmbedding = await generateGeminiResponse(user_message, "embedding"); // Get embedding
        const collection = await chroma.getCollection({
            name: "movie_dialogues",
            embeddingFunction: { generate: async (texts: string[]) => [] } // Dummy function
        });

        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 1, // Get the most relevant match
        });

        let mostRelevantDialogue = null;
        if (results.documents.length > 0) {
            mostRelevantDialogue = results.documents[0]; // Extract best match
            console.log(`🔍 Found relevant dialogue: ${mostRelevantDialogue}`);
        }

        // 3️⃣ Use the retrieved dialogue as context for Gemini AI
        const context = mostRelevantDialogue ? `${character}: ${mostRelevantDialogue}` : "";
        const aiResponse = await generateGeminiResponse(user_message, context);

        res.json({ response: aiResponse, source: mostRelevantDialogue ? "ChromaDB" : "genAi", context });

    } catch (error) {
        console.error("❌ Error fetching response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
