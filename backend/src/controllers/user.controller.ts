import { Router, Response, NextFunction } from "express";
import { getUserProfile, updateUserProfile } from "../services/user.service";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

const sendSuccess = (res: Response, data: unknown, message: string, status: number) =>
  res.status(status).json({ success: true, message, data });

const sendError = (res: Response, message: string, status: number) =>
  res.status(status).json({ success: false, message });

router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await getUserProfile(req.params.id);

    if (!result.success) {
      return sendError(res, result.message, result.status);
    }

    return sendSuccess(res, result.data, "User profile fetched", result.status);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return sendError(res, "At least one field (name/email) required", 400);
    }

    const result = await updateUserProfile(req.params.id, req.body);

    if (!result.success) {
      return sendError(res, result.message, result.status);
    }

    return sendSuccess(res, result.data, "User profile updated", result.status);
  } catch (err) {
    next(err);
  }
});

export default router;