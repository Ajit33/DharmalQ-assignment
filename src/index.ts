
import express from "express"
import { checkDatabaseConnection } from "./config/dbConnection"
import cors from "cors"
import prisma from "./db/PrismaClient"
import dotenv from "dotenv"
import rootRouter from "./route/index"
import rateLimiter from "./middlewares/rateLimiter"




const app=express()
app.use(express.json())
dotenv.config()
app.use("/api/v1/",rateLimiter,rootRouter)
app.use(cors())


const PORT=process.env.PORT
app.listen(PORT,async()=>{
    await checkDatabaseConnection(prisma)
    console.log(`server is running on port  ${PORT}`)
})