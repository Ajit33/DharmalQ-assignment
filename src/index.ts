
import express from "express"
import { checkDatabaseConnection } from "./config/dbConnection"
import cors from "cors"
import prisma from "./db/PrismaClient"
import dotenv from "dotenv"
import rootRouter from "./route/index"




const app=express()
app.use(express.json())
dotenv.config()
app.use("/api/v1/",rootRouter)
app.use(cors())


const PORT=process.env.PORT
app.listen(PORT,async()=>{
    await checkDatabaseConnection(prisma)
    console.log(`server is running on port  ${PORT}`)
})