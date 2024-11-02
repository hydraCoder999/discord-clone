import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "../../../../types";
import { redisInit, redisPublisher, redisSubcriber } from "@/lib/redis";

export const config = {
  api: {
    bodyParser: false,
  },
};
let ioInitialized = false;

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    // console.log("Initializing new Socket.IO server...");
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket/io",
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL,
        methods: ["GET", "POST", "PATCH", "PUT"],
      },
    });
    if (!ioInitialized) {
      redisInit(io); // Move redisInit out of connection handler
      ioInitialized = true;
    }

    io.on("connection", async (socket) => {
      console.log("A user connected");
      socket.emit("connected", { message: "You are connected!" });
      // await redisPublisher.publish(
      //   "MESSAGES",
      //   JSON.stringify({ message: "You are connected!" })
      // );

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.IO server already initialized.");
  }

  res.end();
};

export default ioHandler;
