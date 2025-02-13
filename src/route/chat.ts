import express from "express"
import { getCharacterResponse } from "../controller/chatController"
const route =express.Router()

route.post("/",getCharacterResponse)


export default route