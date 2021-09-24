import { createServer, Server } from "http";
import { Server as IOServer, Socket } from "socket.io";

export default function RealTimeServer(): Server {
    const httpServer: Server = createServer();
    const io: IOServer = new IOServer(httpServer, { /* options */ });

    io.on("connection", (socket: Socket) => {
        console.log("got a new connection from: " + socket.id);
    });

    return httpServer;
}