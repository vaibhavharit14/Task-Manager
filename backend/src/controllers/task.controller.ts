import { Router, Response } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getDashboardTasks,
} from "../services/task.service";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";
import { z } from "zod";

const router = Router();

const sendSuccess = (res: Response, result: any) =>
  res.status(result.status).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });

const sendError = (res: Response, error: any) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ success: false, message: "Validation error", errors: error.issues }); // Use issues or errors
  }
  return res.status(500).json({ success: false, message: "Server error", data: null });
}

// Create Task
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const result = await createTask(validatedData, (req.user as any).id);
    return sendSuccess(res, result);
  } catch (err) {
    return sendError(res, err);
  }
});

// Get All Tasks
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await getTasks((req.user as any).id);
    return sendSuccess(res, result);
  } catch (err) {
    return sendError(res, err);
  }
});

// Update Task
router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const validatedData = updateTaskSchema.parse(req.body);
    const result = await updateTask(req.params.id, validatedData, (req.user as any).id);
    return sendSuccess(res, result);
  } catch (err) {
    return sendError(res, err);
  }
});

// Delete Task
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await deleteTask(req.params.id, (req.user as any).id);
    return sendSuccess(res, result);
  } catch (err) {
    return sendError(res, err);
  }
});

// Dashboard Tasks
router.get("/dashboard", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await getDashboardTasks((req.user as any).id);
    return sendSuccess(res, result);
  } catch (err) {
    return sendError(res, err);
  }
});

export default router;