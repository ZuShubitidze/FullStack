import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
    // Temporary Access Token
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
    // Refresh Token
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
        expiresIn: "7d",
    });
    const isProd = process.env.NODE_ENV === "production";
    // Set Refresh Token in a secure HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd, // true on Render, false on Localhost
        sameSite: isProd ? "none" : "lax", // "none" for Vercel -> Render
        path: "/auth/refresh", // Only sent to the refresh endpoint for security
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Send Access Token to frontend memory
    return accessToken;
};
//# sourceMappingURL=generateToken.js.map