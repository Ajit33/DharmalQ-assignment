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

        let mostRelevantDialogue: { response: string; user_message: string; character: string } | null = null;

        try {
            const queryEmbedding = await generateGeminiResponse(user_message, "embedding");

            const collection = await chroma.getCollection({
                name: "movie_dialogues",
                embeddingFunction: { generate: async (texts: string[]) => [] },
            });

            const results = await collection.query({
                queryEmbeddings: [queryEmbedding],
                nResults: 3, 
            });

            console.log("🔍 ChromaDB Query Results:", results);

            mostRelevantDialogue = null;

            if (results.metadatas && results.metadatas.length > 0 && Array.isArray(results.metadatas[0])) {
                const metadataArray = results.metadatas[0];

                const filteredMatch = metadataArray.find(
                    (metadata) => metadata && String(metadata.character).toLowerCase() === character.toLowerCase()
                );
                

                if (filteredMatch && typeof filteredMatch === "object" && "response" in filteredMatch) {
                    mostRelevantDialogue = filteredMatch as { response: string; user_message: string; character: string };
                    console.log(`Found Relevant Dialogue for ${character}: ${mostRelevantDialogue.response}`);
                }
            }
        } catch (err) {
            console.error("Error retrieving from ChromaDB:", err);
        }

        const context = mostRelevantDialogue
            ? `You are ${character}. The user is asking you a question.\n\nHere is an example of how you talk:\n"${mostRelevantDialogue.response}"\n\nRespond in the same style.`
            : null;

        const aiResponse = await generateGeminiResponse(user_message, context || `You are ${character}. Respond in your unique movie character style.`);

        res.json({
            response: aiResponse.trim(),
            source: "Gemini AI",
            context: mostRelevantDialogue ? mostRelevantDialogue.response : null
        });

    } catch (error) {
        console.error(" Error fetching response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
