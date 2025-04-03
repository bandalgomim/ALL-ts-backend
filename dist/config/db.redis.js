"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOST || "localhost";
const redisClient = (0, redis_1.createClient)({
    url: `redis://${redisHost}:${redisPort}`,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient
    .connect()
    .then(() => {
    console.log("Connected to Redis");
})
    .catch(console.error);
exports.default = redisClient;
