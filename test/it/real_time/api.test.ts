import { assert } from "chai";
import { Done } from "mocha";
import { io } from "socket.io-client";
import RealTimeServer from "../../../src/real_time/api";

describe("Real Time Server Connection", () => {
  const server = RealTimeServer();
  beforeEach(() => {
    server.listen(1234);
  });
  afterEach(() => {
    server.close();
  });

  it("should establish connection with real_time server", (done: Done) => {
    const socket = io("ws://localhost:1234/");
    socket.on("connect", () => {
      assert(socket.connected);
      done();
    });
  });
});
