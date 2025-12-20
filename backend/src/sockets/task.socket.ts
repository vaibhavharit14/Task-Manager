import { Server } from "socket.io";

export default function registerTaskSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("taskUpdated", (task) => {
      io.emit("taskUpdated", task);
    });

    socket.on("taskAssigned", (task) => {
      io.emit("taskAssigned", task);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}