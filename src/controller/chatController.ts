import { Request, Response } from "express";
import { chatQueue } from "../utils/queue"; 
import redisClient from "../utils/redisClient"; 
import dotenv from "dotenv";

dotenv.config();

export const getCharacterResponse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { character, user_message } = req.body;

        if (!character || !user_message) {
            res.status(400).json({ error: "Character and message are required." });
            return;
        }

        const redisKey = `chat:${character}:${user_message}`;

        try {
            // 🔍 Check if response exists in Redis cache
            const cachedResponse = await redisClient.get(redisKey);
            if (cachedResponse) {
                console.log(" Cache hit:", cachedResponse);
                res.json({ response: cachedResponse, source: "Redis Cache", context: null });
                return;
            }
        } catch (redisError) {
            console.error(" Redis Error:", redisError);
        }

        //  Add task to queue instead of processing synchronously
        await chatQueue.add("processChat", { character, user_message, redisKey });

        //  Return fast response while worker processes the task
        res.json({ message: "Processing your request... Please wait!", taskQueued: true });

    } catch (error) {
        console.error(" Error fetching response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
