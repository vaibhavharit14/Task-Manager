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
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:5174",
        "https://task-manager-orpin-five.vercel.app"
      ].filter(Boolean) as string[];

      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }
));
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Task Manager Backend is running 🚀");
});

app.use("/api/auth", authController);

app.use("/api/tasks", authMiddleware, taskController);
app.use("/api/users", authMiddleware, userController);

app.use(errorMiddleware);

export default app;