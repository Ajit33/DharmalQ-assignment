import { Request, Response } from "express";
import prisma from "../db/PrismaClient";



export const getChatHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ error: "User ID is required." });
            return;
        }

        const chatHistory = await prisma.chatHistory.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        res.json(chatHistory);
    } catch (error) {
        console.error(" Error fetching chat history:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};