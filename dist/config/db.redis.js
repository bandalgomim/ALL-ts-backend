"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const redisUser = process.env.REDISUSER || "default";
const redisPassword = process.env.REDISPASSWORD || "qksekfrha1.";
const redisHost = process.env.REDISHOST || "localhost";
const redisPort = process.env.REDISPORT || 6379;
const redisClient = (0, redis_1.createClient)({
    url: `redis://${redisUser}:${redisPassword}@${redisHost}:${redisPort}`, // ← 비번 추가!
    // username: 'default', // Redis 6 이상에서 ACL 계정 쓰는 경우 (기본은 default)
});
redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient
    .connect()
    .then(() => {
    console.log("✅ Connected to Redis");
})
    .catch(console.error);
exports.default = redisClient;
