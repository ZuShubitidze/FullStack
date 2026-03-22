import "dotenv/config";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import type { Request, Response, NextFunction } from "express";

// Define what JWT payload looks like
interface DecodedToken extends jwt.JwtPayload {
  id: number;
}

// Add 'user' to the Express Request type
declare global {
  namespace Express {
    interface Request {
      user: { id: number }; // You can make this more specific with your User type
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Split token from "Bearer"
  const token = authHeader.split(" ")[1];

  if (!token || token === "undefined") {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    // Find user in Database
    // Attach user to the request object
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true },
    });
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    req.user = user;

    next();
  } catch (err: any) {
    console.error("JWT Error Name:", err.name); // e.g., 'TokenExpiredError' or 'JsonWebTokenError'
    console.error("JWT Error Message:", err.message); // e.g., 'invalid signature'
    res.status(401).json({ error: `Verification failed: ${err.message}` });
  }
};
