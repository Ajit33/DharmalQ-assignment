import { Worker, QueueEvents, Queue } from "bullmq";
import IORedis from "ioredis";
import { generateGeminiResponse } from "../utils/geminAiHelper";
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";

dotenv.config();

const chroma = new ChromaClient({ path: process.env.CHROMA_DB_PATH! });

// Fetch ChromaDB collection once at startup
let collection: any;
(async () => {
    collection = await chroma.getCollection({
        name: "movie_dialogues",
        embeddingFunction: { generate: async (texts: string[]) => [] },
    });
})();

// Redis connection for BullMQ
const redisConnection = new IORedis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
});

redisConnection.on("error", (err) => console.error("❌ Redis Error:", err));
console.log("✅ Redis Connected for BullMQ");

// Define the queue
const queueName = "chat-processing";
const queue = new Queue(queueName, { connection: redisConnection });
const queueEvents = new QueueEvents(queueName, { connection: redisConnection });

// Log completed and failed jobs
queueEvents.on("completed", ({ jobId }) => console.log(`✅ Job ${jobId} completed`));
queueEvents.on("failed", ({ jobId, failedReason }) => console.error(`❌ Job ${jobId} failed: ${failedReason}`));

// Worker scaling configuration
const MIN_WORKERS = 2;   // Minimum workers (default idle state)
const MAX_WORKERS = 50;  // Maximum workers (to prevent overloading)
const CHECK_INTERVAL = 5000; // Check queue size every 5 seconds

let activeWorkers: Worker[] = [];
let workerCount = MIN_WORKERS;

// Function to create a worker
const createWorker = (workerIndex: number) => {
    const worker = new Worker(
        queueName,
        async (job) => {
            const { character, user_message, redisKey } = job.data;
            console.log(`👷 Worker ${workerIndex + 1}: Processing "${character}" - "${user_message}"`);

            let mostRelevantDialogue: { response: string; user_message: string; character: string } | null = null;

            try {
                // Generate embedding
                const queryEmbedding = await generateGeminiResponse(user_message, "embedding");

                // Query ChromaDB
                const results = await collection.query({
                    queryEmbeddings: [queryEmbedding],
                    nResults: 3,
                });

                if (results.metadatas?.length > 0 && Array.isArray(results.metadatas[0])) {
                    const metadataArray = results.metadatas[0];

                    const filteredMatch = metadataArray.find(
                        (metadata) => metadata && String(metadata.character).toLowerCase() === character.toLowerCase()
                    );

                    if (filteredMatch && typeof filteredMatch === "object" && "response" in filteredMatch) {
                        mostRelevantDialogue = filteredMatch as { response: string; user_message: string; character: string };
                        console.log(`✅ Worker ${workerIndex + 1}: Found Relevant Dialogue for ${character}`);
                    }
                }
            } catch (err) {
                console.error(`❌ Worker ${workerIndex + 1}: Error retrieving from ChromaDB:`, err);
            }

            // Generate AI response using Gemini
            const context = mostRelevantDialogue
                ? `You are ${character}. The user is asking you a question.\n\nHere is an example of how you talk:\n"${mostRelevantDialogue.response}"\n\nRespond in the same style.`
                : `You are ${character}. Respond in your unique movie character style.`;

            const aiResponse = await generateGeminiResponse(user_message, context);

            // Store response in Redis
            await redisConnection.set(redisKey, aiResponse.trim(), "EX", 3600);

            console.log(`✅ Worker ${workerIndex + 1}: AI Response Cached for ${character}`);
            return aiResponse;
        },
        { connection: redisConnection }
    );

    return worker;
};

// Function to adjust the number of workers dynamically
const adjustWorkers = async () => {
    const jobCounts = await queue.getJobCounts();
    const pendingJobs = jobCounts.waiting + jobCounts.active;
    
    console.log(`📊 Queue Load: ${pendingJobs} pending jobs, ${workerCount} active workers`);

    if (pendingJobs > workerCount * 2 && workerCount < MAX_WORKERS) {
        // Scale up workers
        const newWorker = createWorker(workerCount);
        activeWorkers.push(newWorker);
        workerCount++;
        console.log(`⬆️ Scaling UP: Increased to ${workerCount} workers`);
    } else if (pendingJobs < workerCount / 2 && workerCount > MIN_WORKERS) {
        // Scale down workers
        const removedWorker = activeWorkers.pop();
        if (removedWorker) await removedWorker.close();
        workerCount--;
        console.log(`⬇️ Scaling DOWN: Decreased to ${workerCount} workers`);
    }
};

// Start with minimum workers
for (let i = 0; i < MIN_WORKERS; i++) {
    activeWorkers.push(createWorker(i));
}
console.log(`✅ Started with ${MIN_WORKERS} workers.`);

// Periodically adjust worker count
setInterval(adjustWorkers, CHECK_INTERVAL);