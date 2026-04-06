import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import {
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterInput,
  type UpdateProfileInput,
} from "../validators/authValidators.js";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { addEmailToQueue } from "../queues/emailQueue.js";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
      };
    }
  }
}

// Register
const register = async (req: Request, res: Response) => {
  const { name, email, password }: RegisterInput = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });
  if (existingUser) {
    return res.status(409).json({
      message: "User with given email already exists",
      error: "DUPLICATE_EMAIL",
    });
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      Image: true,
    },
  });

  // Generate JWT Token
  const token = generateToken(newUser.id, res);

  addEmailToQueue(newUser.email, "Welcome to my app!", "welcome", {
    name: newUser.name,
  });

  res.status(201).json({
    status: "Success",
    message: "User successfully created",
    data: {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        Image: newUser.Image,
      },
      accessToken: token,
    },
  });
  // Pino Log
  req.log.info(
    { userId: newUser.id, email: newUser.email },
    `User ${newUser.name} registered successfully`,
  );
};

// Login
// const login = async (req: Request, res: Response) => {
//   // Get email and password from request
//   const { email, password }: LoginInput = req.body;

//   // Check if user exists in the Database table
//   const existingUser = await prisma.user.findUnique({
//     where: { email: email },
//   });
//   console.log("User Found:", !!existingUser);
//   console.log("DATABASE_URL in Controller:", process.env.DATABASE_URL);

//   // If user with this email doesn't exist or password is incorrect
//   if (
//     !existingUser ||
//     !(await bcrypt.compare(password, existingUser.password))
//   ) {
//     return res.status(401).json({
//       error: "Incorrect email or password",
//     });
//   }
//   const isMatch = await bcrypt.compare(password, existingUser.password);
//   console.log("Password Match:", isMatch);

//   // User exists and password is correct
//   // Generate JWT token
//   const token = generateToken(existingUser.id, res);

//   // Success
//   res.status(200).json({
//     status: "Success",
//     message: "Successfully logged in",
//     data: {
//       user: {
//         id: existingUser.id,
//         email: existingUser.email,
//         name: existingUser.name,
//         Image: existingUser.Image,
//       },
//       accessToken: token,
//     },
//   });
// };
async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return false;
  const match = await bcrypt.compare(password, user.password);
  return match ? user : false;
}

// Logout
const logout = async (req: Request, res: Response) => {
  const isProd = process.env.NODE_ENV === "production";
  // Remove cookie
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: isProd, // true on Render, false on Localhost
    sameSite: isProd ? "none" : "lax", // "none" for Vercel -> Render
    expires: new Date(0), // Kill instantly
    path: "/auth/refresh", // Only sent to the refresh endpoint for security
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

// Access current user for AuthContext / Frontend
const getMe = async (req: Request, res: Response) => {
  const fullUser = await prisma.user.findUnique({
    where: { id: req.user.id },
    // Choose data to send back to AuthContext
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      Image: true,
    },
  });
  // Error
  if (!fullUser) {
    return res.status(200).json({ message: "User not found" });
  }
  // Send full user to frontend
  res.status(200).json({
    status: "Success",
    data: {
      user: fullUser,
    },
  });
};

// Refresh Access Token with Refresh Token for security
const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) {
      // Return 200 or 204 instead of 401 to keep the console clean
      return res.status(200).json({ loggedIn: false, accessToken: null });
    }

    const refreshSecret = process.env.REFRESH_SECRET;
    const jwtSecret = process.env.JWT_SECRET;
    if (!refreshSecret) {
      throw new Error(
        "REFRESH_SECRET is not defined in the environment variables",
      );
    }
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }
    const decoded = jwt.verify(refreshToken, refreshSecret) as {
      id: string | number;
    };

    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.id) },
      select: { id: true },
    });

    if (!user) {
      res.clearCookie("refreshToken", { path: "/auth/refresh" });
      return res.status(401).json({ message: "User no longer exists" });
    }

    const newAccessToken = jwt.sign({ id: decoded.id }, jwtSecret, {
      expiresIn: "15m",
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.clearCookie("refreshToken", { path: "/auth/refresh" });
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Update Profile
const updateProfile = async (req: Request, res: Response) => {
  const { userId, imageUrl }: UpdateProfileInput = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: { Image: imageUrl ?? null }, // Match capital 'I'
    select: {
      // Consistent with getMe select
      id: true,
      email: true,
      name: true,
      createdAt: true,
      Image: true,
    },
  });
  // Return Updated Object
  res.json(updatedUser);
};

const health = async (req: Request, res: Response) => {
  res.send("OK");
};

// Refresh Password
// const forgotPassword = async (req: Request, res: Response) => {
//   const { email }: ForgotPasswordInput = req.body;
//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user) {
//     // For security, don't tell them whether account exists or not
//     return res.json({
//       message: "If an account exists, a reset email will be sent ",
//     });
//   }

//   const jwtSecret = process.env.JWT_SECRET;
//   if (!jwtSecret) {
//     throw new Error("JWT_SECRET is not defined in the environment variables");
//   }

//   // Create a secure token
//   const resetToken = jwt.sign({ id: user.id }, jwtSecret, {
//     expiresIn: "15m",
//   });

//   await prisma.user.update({
//     where: { id: user.id },
//     data: {
//       resetPasswordToken: resetToken,
//       resetPasswordExpire: new Date(Date.now() + 3600000), // 1 hour from now
//     },
//   });

//     // Add to BullMQ
//   const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//   await addEmailToQueue(
//     user.email,
//     "Password Reset Request",
//     "reset-password",
//     { name: user.name, resetLink: resetUrl, appName: "My Awesome App" }
//   );

//   res.json({ message: "Reset link sent to email" });
// };

export { register, login, logout, getMe, refresh, updateProfile, health };
