
import express from "express"
import { getChatHistory } from "../controller/chatHistoryController";

const route=express.Router();
/**
 * @swagger
 * /chat-history/{userId}:
 *   get:
 *     summary: Get chat history for a user
 *     description: Retrieve the chat history for a specific user based on their userId.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID whose chat history is being requested.
 *     responses:
 *       200:
 *         description: Successfully retrieved chat history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "eb6b0a6f-5c7f-412f-b736-48dcd35f6f5c"
 *                   userId:
 *                     type: string
 *                     example: "123"
 *                   character:
 *                     type: string
 *                     example: "Spiderman"
 *                   userMessage:
 *                     type: string
 *                     example: "Why do you wear a mask?"
 *                   botResponse:
 *                     type: string
 *                     example: "Web-slinger here! The mask keeps my identity secret!"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-22T23:07:16.825Z"
 *       400:
 *         description: Bad request, invalid userId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or missing userId."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while retrieving chat history."
 */
route.get("/:userId",getChatHistory)


export default route