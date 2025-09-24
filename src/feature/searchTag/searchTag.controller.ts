
import { Request, Response } from "express";
import redisClient from "../../../config/db.redis";

export const searchTagController = {
    get: async (req: Request, res: Response) => {
        const result = await redisClient.get("searchTag");
        res.json(result);
    }
};
