import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { registerSchema } from "../validators/authValidators.js";
import jwt from "jsonwebtoken";

// Register
const register = async (req, res) => {
  try {
    // Validate request data
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors, // Gives clean errors per field
      });
    }
    // Access validated data
    const { name, email, password } = validation.data;

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
      select: { id: true, name: true, email: true, createdAt: true }, // Skip Password automatically
    });

    // Generate JWT Token
    const token = generateToken(newUser.id, res);

    res.status(201).json({
      status: "Success",
      message: "User successfully created",
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    // Get email and password from request
    const { email, password } = req.body;

    // Basic Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide email and password" });
    }

    // Check if user exists in the Database table
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    console.log("DEBUG USER FROM DB:", existingUser);

    // If user with this email doesn't exist or password is incorrect
    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      return res.status(401).json({
        error: "Incorrect email or password",
      });
    }
    // User exists and password is correct
    // Generate JWT token
    const token = generateToken(existingUser.id, res);

    // Success
    res.status(200).json({
      status: "Success",
      message: "Successfully logged in",
      data: {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        },
        accessToken: token,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout
const logout = async (req, res) => {
  // Remove cookie
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: isProd, // true on Render, false on Localhost
    sameSite: isProd ? "none" : "lax", // "none" for Vercel -> Render
    path: "/auth/refresh", // Only sent to the refresh endpoint for security
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

// Access current user for AuthContext / Frontend
const getMe = async (req, res) => {
  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      // Choose data to send back to AuthContext
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
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
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Refresh Access Token with Refresh Token for security
const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    // Return 200 or 204 instead of 401 to keep the console clean
    return res.status(200).json({ loggedIn: false, accessToken: null });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export { register, login, logout, getMe, refresh };
