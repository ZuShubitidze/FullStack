import "dotenv/config";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const protect = async (req, res, next) => {
  // Get token
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ error: "Not logged in" });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user in Database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true },
    });

    if (!user) return res.status(401).json({ error: "User no longer exists" });

    req.user = user; // Attach user to the request object
    next();
  } catch (err) {
    res.status(401).json({ error: `Verification failed: ${err.message}` });
    // res.status(401).json({ error: "Invalid token" });
    console.error("JWT Error Name:", err.name); // e.g., 'TokenExpiredError' or 'JsonWebTokenError'
    console.error("JWT Error Message:", err.message); // e.g., 'invalid signature'
  }
};
