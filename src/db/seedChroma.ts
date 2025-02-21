import { ChromaClient } from 'chromadb';
import { PrismaClient } from '@prisma/client';
import { GeminiAI } from '../utils/gemin';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
 export const chroma = new ChromaClient({ path: process.env.CHROMA_DB_PATH! });

async function seedChroma() {
  try {
    console.log(" Fetching dialogues from PostgreSQL...");
    const dialogues = await prisma.dialogue.findMany({
      select: { id: true, character: { select: { name: true } }, user_message: true, response: true }
    });

    console.log(`Retrieved ${dialogues.length} dialogues.`);

    // Create a ChromaDB collection
    const collection = await chroma.getOrCreateCollection({ name: 'movie_dialogues' });

    for (const dialogue of dialogues) {
      const text = `${dialogue.character.name}: ${dialogue.user_message} -> ${dialogue.response}`;
      console.log(`🔍 Generating embedding for: "${text}"`);

      const embedding = await GeminiAI.getEmbedding(text);

      // Add to ChromaDB
      await collection.add({
        ids: [dialogue.id.toString()],
        documents: [text],
        metadatas: [{ character: dialogue.character.name, user_message: dialogue.user_message, response: dialogue.response }],
        embeddings: [embedding]
      });

      console.log(`Stored: ${dialogue.character.name} -> ${dialogue.user_message}`);
    }

    console.log("🚀 Seeding completed successfully!");
  } catch (error) {
    console.error(" Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChroma();
