
import express from "express"
import { checkDatabaseConnection } from "./config/dbConnection"
import { Prisma } from "@prisma/client"
import prisma from "./db/PrismaClient"
import dotenv from "dotenv"
import rootRouter from "./route/index"




const app=express()
app.use(express.json())
dotenv.config()
app.use("/api/v1/",rootRouter)
 
app.listen(3000,async()=>{
    await checkDatabaseConnection(prisma)
    console.log("server is running on port 3000")
})