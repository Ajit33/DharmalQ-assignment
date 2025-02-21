import { Request, Response } from "express";

import dotenv from "dotenv";
import { fetchCharacterResponse } from "../service/fetchCharacterResponse";

dotenv.config();

export const getCharacterResponse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, character, user_message } = req.body;

        if (!userId || !character || !user_message) {
            res.status(400).json({ error: "User ID, Character, and Message are required." });
            return;
        }

        const response = await fetchCharacterResponse(userId, character, user_message);
        res.json(response);
    } catch (error) {
        console.error(" Error fetching response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};