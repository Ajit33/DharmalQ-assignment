import { Queue } from "bullmq";

export const chatQueue = new Queue("chat-processing", {
    connection: {
        host: process.env.REDIS_HOST || "redis",
        port: Number(process.env.REDIS_PORT) || 6379,
    },
});
