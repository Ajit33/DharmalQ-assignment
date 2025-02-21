import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { checkDatabaseConnection } from "./config/dbConnection";
import cors from "cors";
import prisma from "./db/PrismaClient";
import dotenv from "dotenv";
import rootRouter from "./route/index";


import rateLimiter from "./middlewares/rateLimiter";
import { fetchCharacterResponse,} from "./controller/chatController";

dotenv.config();

const app = express();
const server = createServer(app); // Create HTTP Server
const wss = new WebSocketServer({ server }); // Create WebSocket Server

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1/",rateLimiter, rootRouter);

const PORT = process.env.PORT || 3000;

// Handle WebSocket Connections
wss.on("connection", (ws) => {
    console.log("Client connected");
  
    ws.on("message", async (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log(parsedMessage)
        // Ensure required properties exist
        if (!parsedMessage.character || !parsedMessage.user_message) {
          ws.send(JSON.stringify({ error: "Character and message are required." }));
          return;
        }
  
        const { character, user_message } = parsedMessage;
         console.log(character,user_message)
        // ✅ Use fetchCharacterResponse instead of getCharacterResponse
        const response = await fetchCharacterResponse(character, user_message);
  
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
