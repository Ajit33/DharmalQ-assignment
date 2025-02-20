import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || "localhost", 
        port: Number(process.env.REDIS_PORT) || 6379,
    },
});

redisClient.on("error", (err) => console.error(" Redis Error:", err));

(async () => {
    try {
        await redisClient.connect();
        console.log("✅ Connected to Redis");
    } catch (err) {
        console.error(" Redis connection failed:", err);
    }
})();

export default redisClient;
