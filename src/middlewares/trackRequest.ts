import { Request, Response } from "express";
import client from "prom-client"



const register=new client.Registry()
// metrics
const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.5, 1, 2, 5], // Response time buckets
});

const requestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total number of requests",
    labelNames: ["method", "route", "status_code"],
});

register.registerMetric(httpRequestDuration);
register.registerMetric(requestCounter);
client.collectDefaultMetrics({ register });

 export const TrackRequest=((req:Request, res:Response, next:any) => {
    const end = httpRequestDuration.startTimer();
    res.on("finish", () => {
        requestCounter.inc({ method: req.method, route: req.path, status_code: res.statusCode });
        end({ method: req.method, route: req.path, status_code: res.statusCode });
    });
    next();
});