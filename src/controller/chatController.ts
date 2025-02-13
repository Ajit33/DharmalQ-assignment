

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
            where: { name: character }
        });

        if (!characterEntry) {
            console.log(`Character '${character}' not found, using Gemini AI.`);
            const aiResponse = await generateGeminiResponse(character, user_message);
            res.json({ response: aiResponse });
            return;
        }

        // 2️⃣ Find an exact dialogue match (case-insensitive)
        const exactMatch = await prisma.dialogue.findFirst({
            where: {
                characterId: characterEntry.id,
                user_message: { equals: user_message, mode: "insensitive" }
            }
        });

        if (exactMatch) {
            res.json({ response: exactMatch.response });
            return;
        }

        // 3️⃣ Find a similar match using Prisma's raw query for `pg_trgm`
        const similarMatch = await prisma.$queryRaw<
            { response: string }[]
        >`
        SELECT response FROM "Dialogue"
        WHERE "characterId" = ${characterEntry.id}
        ORDER BY similarity(user_message, ${user_message}) DESC
        LIMIT 1
        `;

        if (similarMatch.length > 0) {
            res.json({ response: similarMatch[0].response });
            return;
        }

        // 4️⃣ No exact or similar match → Generate a response using Gemini AI
        console.log(`No match for '${user_message}', using Gemini AI.`);
        const aiResponse = await generateGeminiResponse(character, user_message);
        res.json({ response: aiResponse });

    } catch (error) {
        console.error("Error fetching response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
