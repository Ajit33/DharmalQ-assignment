import { Request, Response } from "express";
import redisClient from "../utils/redisClient";
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

        const response = await fetchCharacterResponse(character, user_message);
        res.json(response);
    } catch (error) {
        console.error("❌ Error fetching response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const fetchCharacterResponse = async (character: string, user_message: string) => {
    try {
        const redisKey = `chat:${character}:${user_message}`;

        // 🔹 Check Redis Cache First
        const cachedResponse = await redisClient.get(redisKey);
        if (cachedResponse) {
            console.log("✅ Cache hit:", cachedResponse);
            return { response: cachedResponse, source: "Redis Cache", context: null };
        }

        console.log("❌ Cache miss. Querying ChromaDB...");

        let mostRelevantDialogue: { response: string; user_message: string; character: string } | null = null;

        try {
            // 🔹 Get the ChromaDB Collection
            const collection = await chroma.getCollection({
                name: "movie_dialogues",
                embeddingFunction: { generate: async (texts: string[]) => [] },
            });

            // 🔹 Generate Embedding for User Message
            const queryEmbedding = await generateGeminiResponse(user_message, "embedding");

            // 🔹 Search ChromaDB for Relevant Dialogues
            const results = await collection.query({
                queryEmbeddings: [queryEmbedding],
                nResults: 3,
            });

            console.log("🔍 ChromaDB Query Results:", results);

            if (results.metadatas?.length > 0 && Array.isArray(results.metadatas[0])) {
                const metadataArray = results.metadatas[0];

                // 🔹 Find the Most Relevant Dialogue for the Character
                const filteredMatch = metadataArray.find(
                    (metadata) => metadata && String(metadata.character).toLowerCase() === character.toLowerCase()
                );

                if (filteredMatch && typeof filteredMatch === "object" && "response" in filteredMatch) {
                    mostRelevantDialogue = filteredMatch as { response: string; user_message: string; character: string };
                    console.log(`🎭 Found Relevant Dialogue for ${character}: "${mostRelevantDialogue.response}"`);
                }
            }
        } catch (err) {
            console.error("❌ Error retrieving from ChromaDB:", err);
        }

        // 🔹 Construct AI Prompt Context
        const context = mostRelevantDialogue
            ? `You are ${character}. The user is asking you a question.\n\nHere is an example of how you talk:\n"${mostRelevantDialogue.response}"\n\nRespond in the same style.`
            : `You are ${character}. Respond in your unique movie character style.`;

        // 🔹 Generate AI Response
        const aiResponse = await generateGeminiResponse(user_message, context);

        // 🔹 Store AI Response in Redis for Future Use (1 hour)
        await redisClient.set(redisKey, JSON.stringify(aiResponse.trim()), { EX: 3600 });

        console.log(`✅ AI Response Cached for ${character}`);

        return {
            response: aiResponse.trim(),
            source: mostRelevantDialogue ? "ChromaDB + Gemini AI" : "Gemini AI",
            context: mostRelevantDialogue ? mostRelevantDialogue.response : null,
        };

    } catch (error) {
        console.error("❌ Error generating response:", error);
        throw new Error("Failed to generate response.");
    }
};
