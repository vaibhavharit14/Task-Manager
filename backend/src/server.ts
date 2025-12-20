import dotenv from "dotenv";
dotenv.config({ override: true });
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import registerTaskSocket from "./sockets/task.socket";

const PORT = process.env.PORT || 5000;
import { setIO } from "./utils/socket";

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
setIO(io);

registerTaskSocket(io);
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
