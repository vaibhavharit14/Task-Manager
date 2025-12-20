import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Error:", err.message || err);

  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      status = 400;
      message = "Duplicate field value (e.g., email already exists)";
    }
  }

  // JWT errors
  if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token expired";
  }
  if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token";
  }

  res.status(status).json({
    success: false,
    message,
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}