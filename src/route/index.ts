import express from "express";
import chatRouter from "./chat"
import chatHistoryRoute from "./chatHistory"
import metrics from "./metrics"
const route=express.Router()

route.use("/chat",chatRouter)
route.use("/chat-history",chatHistoryRoute)
route.use("/metrics",metrics)
export default route;