import { Server } from "socket.io";
import Client from "socket.io-client";
import registerTaskSocket from "../src/sockets/task.socket";

describe("Task Socket", () => {
  let io: Server;
  let clientSocket: ReturnType<typeof Client>;

  beforeAll((done) => {
    io = new Server(4001, { cors: { origin: "*" } });
    registerTaskSocket(io);
    clientSocket = Client("http://localhost:4001");
    clientSocket.on("connect", done);
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  it("should broadcast taskUpdated event", (done) => {
    clientSocket.emit("taskUpdated", { id: "1", title: "Socket Test" });
    clientSocket.on("taskUpdated", (task: any) => {
      expect(task.title).toBe("Socket Test");
      done();
    });
  });

  it("should broadcast taskAssigned event", (done) => {
    clientSocket.emit("taskAssigned", { id: "2", title: "Assigned Task" });
    clientSocket.on("taskAssigned", (task: any) => {
      expect(task.id).toBe("2");
      done();
    });
  });
});