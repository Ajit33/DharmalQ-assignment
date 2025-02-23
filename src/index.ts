import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { checkDatabaseConnection } from "./config/dbConnection";
import cors from "cors";
import prisma from "./db/PrismaClient";
import dotenv from "dotenv";
import rootRouter from "./route/index";
import path from "path";

import rateLimiter from "./middlewares/rateLimiter";
import { fetchCharacterResponse } from "./service/fetchCharacterResponse";
import { TrackRequest } from "./middlewares/trackRequest";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";



dotenv.config();


const app = express();
const server = createServer(app); // Create HTTP Server
const wss = new WebSocketServer({ server }); // Create WebSocket Server

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1/",rateLimiter,TrackRequest, rootRouter);
const PORT = process.env.PORT || 3000;
 




const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Movie Character Chatbot API",
      version: "1.0.0",
      description: "API documentation for AI Movie Character Chatbot",
    },
    servers: [{ url: "http://localhost:5000/api/v1" }],
  },
  apis: [path.join(__dirname, "route/*.ts")], // Ensure correct path
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


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

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
