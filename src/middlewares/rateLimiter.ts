import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../utils/redisClient";

const rateLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: async (...args: any[]) => redisClient.sendCommand(args),
    }),
    windowMs: 1000,
    max: 100, 
    message: " Too many requests. Please try again later.",
    standardHeaders: true, 
    legacyHeaders: false, 
});

export default rateLimiter;