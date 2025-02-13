

import { Request, Response } from "express";
import prisma from "../db/PrismaClient";
import { generateGeminiResponse } from "../utils/geminAiHelper"; // Ensure correct import

export const getCharacterResponse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { character, user_message } = req.body;

        if (!character || !user_message) {
            res.status(400).json({ error: "Character and message are required." });
            return;
        }

        // 1️⃣ Find character in the database
        const characterEntry = await prisma.character.findUnique({
            where: { name: character },
            include: { dialogues: true }
        });

        if (!characterEntry) {
            console.log(`Character '${character}' not found, using Gemini AI.`);
            const aiResponse = await generateGeminiResponse(character, user_message);
            res.json({ response: aiResponse });
            return;
        }

        // 2️⃣ Find a matching dialogue (case-insensitive search)
        const dialogueMatch = await prisma.dialogue.findFirst({
            where: {
                characterId: characterEntry.id,
                user_message: { equals: user_message, mode: "insensitive" } // Fix field name
            }
        });

        if (dialogueMatch) {
            res.json({ response: dialogueMatch.response });
            return;
        }

        // 3️⃣ No exact match → Generate a response using Gemini AI
        console.log(`No exact match for '${user_message}', using Gemini AI.`);
        const aiResponse = await generateGeminiResponse(character, user_message);
        res.json({ response: aiResponse });

    } catch (error) {
        console.error("Error fetching response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
