import express from "express"
import client from "prom-client"

const route=express.Router()
const register=new client.Registry();
route.get("/",async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics=await client.register.metrics();
    res.end(metrics);
})

export default route;