import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest, authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const prisma = new PrismaClient();

const signToken = (userId: string, email: string) =>
  jwt.sign({ id: userId, email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

const sendSuccess = (
  res: Response,
  data: unknown,
  message = "OK",
  status = 200
) => res.status(status).json({ success: true, message, data });

const sendError = (res: Response, message: string, status = 400) =>
  res.status(status).json({ success: false, message });

// ---------------- REGISTER ----------------
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, "All fields are required", 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(res, "User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = signToken(user.id, user.email);

    return sendSuccess(
      res,
      { token, user: { id: user.id, name: user.name, email: user.email } },
      "User registered successfully",
      201
    );
  } catch (err: any) {
    console.error("Register error:", err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return sendError(res, "Email already exists", 400);
      }
    }

    return sendError(res, err.message || "Internal server error", 500);
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password required", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, "Invalid credentials", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, "Invalid credentials", 400);
    }

    const token = signToken(user.id, user.email);

    return sendSuccess(
      res,
      { token, user: { id: user.id, name: user.name, email: user.email } },
      "Login successful",
      200
    );
  } catch (err: any) {
    console.error("Login error:", err);
    return sendError(res, err.message || "Internal server error", 500);
  }
});

// ---------------- CURRENT USER ----------------
// ---------------- CURRENT USER ----------------
router.get(
  "/me",
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return sendError(res, "Unauthorized", 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        return sendError(res, "User not found", 404);
      }

      return sendSuccess(res, { user }, "User fetched successfully", 200);
    } catch (err) {
      console.error("Fetch user error:", err);
      return sendError(res, "Internal server error", 500);
    }
  }
);

export default router;