import { describe, it, expect } from "vitest";
import request from "supertest";
import { faker } from "@faker-js/faker";
import { app } from "../app.js";
import { prisma } from "@lib/prisma.js";
import bcrypt from "bcrypt";

describe("Auth Test", () => {
  it("Should register a new user and return tokens", async () => {
    console.log("TEST DB URL:", process.env.DATABASE_URL);
    const name = faker.internet.username();
    const email = faker.internet.email();
    const response = await request(app).post("/auth/register").send({
      name: name,
      email: email,
      password: "Password123",
    });

    // Response Body Assertions
    const { status, data } = response.body;
    console.log("TESTING ON:", process.env.DATABASE_URL);
    expect(response.status).toBe(201);
    expect(status).toBe("Success");
    // Check AccessToken
    expect(data).toHaveProperty("accessToken");
    expect(typeof data.accessToken).toBe("string");
    // Check RefreshToken
    const cookies = response.get("Set-Cookie") || []; // Set-Cookie is where Superset sets Cookies
    const hasRefreshToken = cookies.some((cookie) =>
      cookie.includes("refreshToken"),
    );
    expect(hasRefreshToken).toBe(true);
    const refreshCookie = cookies.find((c) => c.startsWith("refreshToken"));
    expect(refreshCookie).toMatch(/HttpOnly/i);
    expect(refreshCookie).toMatch(/Path=\/auth\/refresh/i);

    // Veryfy DB state directly with Prisma
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (response.status !== 201) {
      console.log("❌ Register Failed Error:", response.body);
    }
    expect(user).not.toBeNull();
  });

  it("Should login a user and return tokens", async () => {
    // Create User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Password123", salt);
    const email = faker.internet.email();
    const name = faker.internet.username();
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
    const response = await request(app).post("/auth/login").send({
      email: email,
      password: "Password123",
    });

    const { status, data } = response.body;
    expect(response.status).toBe(200);
    expect(status).toBe("Success");
    // Check AccessToken
    expect(data).toHaveProperty("accessToken");
    expect(typeof data.accessToken).toBe("string");
    // Check RefreshToken
    const cookies = response.get("Set-Cookie") || []; // Set-Cookie is where Superset sets Cookies
    const hasRefreshToken = cookies.some((cookie) =>
      cookie.includes("refreshToken"),
    );
    expect(hasRefreshToken).toBe(true);
    const refreshCookie = cookies.find((c) => c.startsWith("refreshToken"));
    expect(refreshCookie).toMatch(/HttpOnly/i);
    expect(refreshCookie).toMatch(/Path=\/auth\/refresh/i);

    // Veryfy DB state directly with Prisma
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    expect(user).not.toBeNull();
  });
});
