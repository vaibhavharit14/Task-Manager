import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

export function useSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Connect to backend URL (ensure VITE_API_URL is set, fallback to localhost:5000 if needed)
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      auth: token ? { token } : undefined,
    });

    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    const handleUpdate = () => {
      console.log("Real-time update received: Invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    };

    socket.on("taskCreated", handleUpdate);
    socket.on("taskUpdated", handleUpdate);
    socket.on("taskDeleted", handleUpdate);
    socket.on("taskAssigned", handleUpdate);

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}