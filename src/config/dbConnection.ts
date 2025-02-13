import { PrismaClient } from "@prisma/client";
import { PrismaClientOptions } from "@prisma/client/runtime/library";

// Database config setup
export const dbconfig: PrismaClientOptions = {
    log: ["query", "info", "warn", "error"],
    errorFormat: "pretty",
};

// Check database connection
export const checkDatabaseConnection = async (prisma: PrismaClient) => {
    try {
        await prisma.$connect();
        console.log("Database is connected ...");
    } catch (error) {
        console.error("Error establishing database connection", error);
    }
};
