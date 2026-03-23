import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error Logged:", err.message);
  req.log.error(
    {
      err,
      userId: req.user?.id,
      url: req.url,
    },
    "Request Failed",
  );

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "Error",
      errors: err.flatten().fieldErrors,
    });
  }

  // Handle Prisma "Not Found" or "Unauthorized"
  if (err.code === "P2025") {
    return res
      .status(404)
      .json({ message: "Resource not found or unauthorized" });
  }

  // Default 500 Error
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};
