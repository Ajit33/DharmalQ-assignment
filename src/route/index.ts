import express from "express";
import chatRouter from "./chat"
const route=express.Router()

route.use("/chat",chatRouter)
export default route;