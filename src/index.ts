import express from "express";
import { checkDatabaseConnection } from "./config/dbConnection";
import cors from "cors";
import prisma from "./db/PrismaClient";
import dotenv from "dotenv";
import rootRouter from "./route/index";
import rateLimiter from "./middlewares/rateLimiter";
import redisClient from "./utils/redisClient"; 

const app = express();
app.use(express.json());
dotenv.config();
app.use("/api/v1/", rootRouter);
app.use(cors());

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        console.log("⏳ Checking database connection...");
        await checkDatabaseConnection(prisma);
        console.log("✅ Database Connected!");

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
