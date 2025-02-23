import express from "express"
import { getCharacterResponse } from "../controller/chatController"

const route =express.Router()


/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Get AI-generated response for a character
 *     description: Fetches a response from the chatbot based on the user's message and character.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "1233"
 *               character:
 *                 type: string
 *                 example: "Ironman"
 *               user_message:
 *                 type: string
 *                 example: "Who are you?"
 *     responses:
 *       200:
 *         description: Successfully retrieved the AI-generated response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "**Ironman:** I am Iron Man."
 *                 source:
 *                   type: string
 *                   example: "Gemini AI"
 *                 context:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Bad request, missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "userId, character, and user_message are required."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while processing your request."
 */

route.get("/",getCharacterResponse)


export default route