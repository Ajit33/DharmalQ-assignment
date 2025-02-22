import { Request, Response, NextFunction } from "express";
import client from "prom-client";

client.collectDefaultMetrics({ register: client.register });

export const TrackRequest = (req: Request, res: Response, next: NextFunction) => {
    next();
};
