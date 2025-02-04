import { createClient } from "redis";
import { config } from "dotenv";

config();

const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOST || "localhost";

const redisClient = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch(console.error);

export default redisClient;
