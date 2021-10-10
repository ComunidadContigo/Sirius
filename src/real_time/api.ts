import { createServer, Server } from "http";
import { Server as IOServer, Socket } from "socket.io";
import environmentConfig from "../common/config/environment.config";
import { Pool } from "pg";

export default function RealTimeServer(): Server {
  const httpServer: Server = createServer();
  const io: IOServer = new IOServer(httpServer, {
    /* options */
  });

  // set up DB connection
  // TODO: Wire it to the httpServer. Maybe convert this to an express app?
  const pool: Pool = new Pool(environmentConfig.dbconfig);

  io.on("connection", (socket: Socket) => {
    console.log("got a new connection from: " + socket.id);
  });

  return httpServer;
}
