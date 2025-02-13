import prisma from "../db/PrismaClient";

async function enablePgTrgm() {
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);
    console.log(" pg_trgm extension enabled!");
}

enablePgTrgm()
    .catch((error) => console.error(" Error enabling pg_trgm:", error))
    .finally(() => prisma.$disconnect());
