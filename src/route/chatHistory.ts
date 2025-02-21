
import express from "express"
import { getChatHistory } from "../controller/chatHistoryController";

const route=express.Router();

route.get("/:userId",getChatHistory)


export default route