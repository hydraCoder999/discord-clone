import Redis from "ioredis";
import { Server as ServerIO } from "socket.io";
const REDIS_CONNECTION_STRING = process.env.REDIS_CONNECTION_STRING || "";

export const redisPublisher = new Redis(REDIS_CONNECTION_STRING);
export const redisSubcriber = new Redis(REDIS_CONNECTION_STRING);

export async function redisInit(io: ServerIO) {
  console.log("Connecting to Redis...");

  redisSubcriber.subscribe("MESSAGES", (err, count) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log(
        `Subscribed successfully to MESSAGES. Subscriber count: ${count}`
      );
    }
  });

  redisSubcriber.on("message", async (channel, redismessage) => {
    // console.log("New message from Redis:", channel, redismessage);

    if (channel === "MESSAGES") {
      const parsedMessage = JSON.parse(redismessage);
      //   console.log("Parsed Message:", parsedMessage);

      const { socketEmmitKey, message } = parsedMessage;
      console.log(socketEmmitKey);

      // Emit message to all connected Socket.IO clients
      io.emit(socketEmmitKey, message);
    }
  });
}
