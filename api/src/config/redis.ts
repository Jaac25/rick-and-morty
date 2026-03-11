import { createClient } from "redis";

export const redis = createClient({
  url: "redis://redis:6379",
});

export const connectRedis = async () => {
  redis.on("connect", () => console.log("Redis connecting"));
  redis.on("ready", () => console.log("Redis ready"));
  redis.on("error", (err) => console.error("Redis error:", err));

  await redis.connect();
  console.log("Redis connected");
};
