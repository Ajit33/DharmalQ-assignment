import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { checkDatabaseConnection } from "./config/dbConnection";
import cors from "cors";
import prisma from "./db/PrismaClient";
import dotenv from "dotenv";
import rootRouter from "./route/index";
import client from "prom-client"

import rateLimiter from "./middlewares/rateLimiter";
import { fetchCharacterResponse } from "./service/fetchCharacterResponse";
import { TrackRequest } from "./middlewares/trackRequest";


dotenv.config();


const app = express();
const server = createServer(app); // Create HTTP Server
const wss = new WebSocketServer({ server }); // Create WebSocket Server

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1/",rateLimiter,TrackRequest, rootRouter);

const PORT = process.env.PORT || 3000;

// Handle WebSocket Connections
wss.on("connection", (ws) => {
    console.log("Client connected");
  
    ws.on("message", async (message) => {
        try {
            const { userId, character, user_message } = JSON.parse(message.toString());
    
            if (!userId || !character || !user_message) {
                ws.send(JSON.stringify({ error: "User ID, Character, and Message are required." }));
                return;
            }
    
            const response = await fetchCharacterResponse(userId, character, user_message);
    
            ws.send(JSON.stringify(response));
      } catch (error) {
        console.error("Error processing message:", error);
        ws.send(JSON.stringify({ error: "Failed to process message" }));
      }
    });
  
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

const startServer = async () => {
    try {
        console.log("Checking database connection...");
        await checkDatabaseConnection(prisma);
        console.log("Database Connected!");

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
