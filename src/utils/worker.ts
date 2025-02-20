import { Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis"; // Import ioredis
import { generateGeminiResponse } from "../utils/geminAiHelper";
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";

dotenv.config();

const chroma = new ChromaClient({ path: process.env.CHROMA_DB_PATH! });
const numWorkers = 20;

// Create a separate Redis connection for BullMQ using ioredis
const redisConnection = new IORedis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
});

redisConnection.on("error", (err) => console.error("❌ Redis Error:", err));

console.log("✅ Redis Connected for BullMQ");

// Use QueueEvents to monitor job status
const queueEvents = new QueueEvents("chat-processing", { connection: redisConnection });
queueEvents.on("completed", ({ jobId }) => console.log(`✅ Job ${jobId} completed`));
queueEvents.on("failed", ({ jobId, failedReason }) => console.error(`❌ Job ${jobId} failed: ${failedReason}`));

// Create multiple workers using a loop
for (let i = 0; i < numWorkers; i++) {
    new Worker(
        "chat-processing",
        async (job) => {
            const { character, user_message, redisKey } = job.data;
            console.log(`⚡ Worker ${i + 1}: Processing AI response for "${character}" - "${user_message}"`);

            let mostRelevantDialogue: { response: string; user_message: string; character: string } | null = null;

            try {
                // Generate embedding
                const queryEmbedding = await generateGeminiResponse(user_message, "embedding");

                // Query ChromaDB
                const collection = await chroma.getCollection({
                    name: "movie_dialogues",
                    embeddingFunction: { generate: async (texts: string[]) => [] },
                });

                const results = await collection.query({
                    queryEmbeddings: [queryEmbedding],
                    nResults: 3,
                });

                console.log(`🔍 Worker ${i + 1}: ChromaDB Query Results`, results);

                if (results.metadatas?.length > 0 && Array.isArray(results.metadatas[0])) {
                    const metadataArray = results.metadatas[0];

                    const filteredMatch = metadataArray.find(
                        (metadata) => metadata && String(metadata.character).toLowerCase() === character.toLowerCase()
                    );

                    if (filteredMatch && typeof filteredMatch === "object" && "response" in filteredMatch) {
                        mostRelevantDialogue = filteredMatch as { response: string; user_message: string; character: string };
                        console.log(`🎭 Worker ${i + 1}: Found Relevant Dialogue for ${character}: ${mostRelevantDialogue.response}`);
                    }
                }
            } catch (err) {
                console.error(`❌ Worker ${i + 1}: Error retrieving from ChromaDB:`, err);
            }

            // Generate AI response using Gemini
            const context = mostRelevantDialogue
                ? `You are ${character}. The user is asking you a question.\n\nHere is an example of how you talk:\n"${mostRelevantDialogue.response}"\n\nRespond in the same style.`
                : null;

            const aiResponse = await generateGeminiResponse(user_message, context || `You are ${character}. Respond in your unique movie character style.`);

            // Store response in Redis for caching (expires in 1 hour)
            await redisConnection.set(redisKey, aiResponse.trim(), "EX", 3600);

            console.log(`✅ Worker ${i + 1}: AI Response Cached for ${character}`);
            return aiResponse;
        },
        { connection: redisConnection } // Correct Redis connection using ioredis
    );
}

console.log(`🚀 ${numWorkers} Workers are running...`);
