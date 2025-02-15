import prisma from "./PrismaClient";

const dialogues = [
    { "character": "Forrest Gump", "user_message": "Tell me something wise.", "response": "Life is like a box of chocolates." },
    { "character": "Forrest Gump", "user_message": "How fast can you run?", "response": "Run, Forrest, run!" },
    { "character": "Forrest Gump", "user_message": "What do you believe in?", "response": "Stupid is as stupid does." },
    { "character": "Forrest Gump", "user_message": "Do you love someone?", "response": "I may not be a smart man, but I know what love is." },

    { "character": "Batman", "user_message": "Who are you?", "response": "I’m Batman." },
    { "character": "Batman", "user_message": "What do you believe in?", "response": "It’s not who I am underneath, but what I do that defines me." },
    { "character": "Batman", "user_message": "Why do you wear the mask?", "response": "The mask is not for you, it’s to protect the people you care about." },
    { "character": "Batman", "user_message": "What is your greatest fear?", "response": "I fear no one. I fight for justice." }
];

async function seedDatabase() {
    try {
        console.log("🧹 Clearing old data...");
        await prisma.dialogue.deleteMany({});
        await prisma.character.deleteMany({});
        console.log("🌱 Seeding new data...");

        for (const { character, user_message, response } of dialogues) {
            // Ensure character exists
            const characterEntry = await prisma.character.upsert({
                where: { name: character },
                update: {},
                create: { name: character }
            });

            // Use upsert() to avoid duplicate user_message errors
            await prisma.dialogue.upsert({
                where: { user_message }, // Ensure unique user_message
                update: { response }, // Update response if user_message already exists
                create: {
                    characterId: characterEntry.id,
                    user_message,
                    response
                }
            });
        }

        console.log("✅ Database seeding complete!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDatabase();
