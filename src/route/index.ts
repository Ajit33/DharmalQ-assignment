import express from "express";
import chatRouter from "./chat"
import chatHistoryRoute from "./chatHistory"
const route=express.Router()

route.use("/chat",chatRouter)
route.use("/chat-history",chatHistoryRoute)
export default route;