import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import authController from "./controllers/auth.controller";
import taskController from "./controllers/task.controller";
import userController from "./controllers/user.controller";

const app = express();

app.use(cors(
  {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }
));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Task Manager Backend is running 🚀");
});

app.use("/api/auth", authController);

app.use("/api/tasks", authMiddleware, taskController);
app.use("/api/users", authMiddleware, userController);

app.use(errorMiddleware);

export default app;