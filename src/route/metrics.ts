import express from "express"
import client from "prom-client"

const route=express.Router()
const register=new client.Registry();
route.get("/",async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
})

export default route;