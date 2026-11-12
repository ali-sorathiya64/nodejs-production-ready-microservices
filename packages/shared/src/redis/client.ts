import Redis from "ioredis";
import { logger } from "../logger/logger";

const client = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 1,
});

client.on("error", (error) => logger.error({ error }, "Redis error"));

export default client;