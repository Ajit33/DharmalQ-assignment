import express from "express"
import { getCharacterResponse } from "../controller/chatController"

const route =express.Router()

route.get("/",getCharacterResponse)


export default route