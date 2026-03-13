import "dotenv/config";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Raw Header:", authHeader); // Check this in Render logs!

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  let token;

  // Check for token in the Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Fallback
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === "undefined") {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user in Database
    // Attach user to the request object
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true },
    });

    next();
  } catch (err) {
    console.error("JWT Error Name:", err.name); // e.g., 'TokenExpiredError' or 'JsonWebTokenError'
    console.error("JWT Error Message:", err.message); // e.g., 'invalid signature'
    res.status(401).json({ error: `Verification failed: ${err.message}` });
  }
};
