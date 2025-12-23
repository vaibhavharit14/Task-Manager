import dotenv from "dotenv";
dotenv.config({ override: true });
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import registerTaskSocket from "./sockets/task.socket";

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("FATAL ERROR: DATABASE_URL is not defined.");
  process.exit(1);
}

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
