vi.mock("@lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));
vi.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    compare: vi.fn(),
  },
}));
import prisma from "@lib/prisma";
import bcrypt from "bcrypt";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { faker } from "@faker-js/faker";
// import { prismaMock } from "../__mocks__/db.js";

const mockUser = {
  id: 1,
  email: "test@test.com",
  password: "hashed",
  name: "Zura",
  createdAt: new Date(),
  Image: "",
};

function asMock<T extends (...args: any[]) => any>(fn: T) {
  return fn as unknown as ReturnType<typeof vi.fn>;
}

describe("Auth Test", () => {
  // it("Should register a new user and return tokens", async () => {
  //   console.log("TEST DB URL:", process.env.DATABASE_URL);
  //   const name = faker.internet.username();
  //   const email = faker.internet.email();
  //   const response = await request(app).post("/auth/register").send({
  //     name: name,
  //     email: email,
  //     password: "Password123",
  //   });

  //   // Response Body Assertions
  //   const { status, data } = response.body;
  //   console.log("TESTING ON:", process.env.DATABASE_URL);
  //   expect(response.status).toBe(201);
  //   expect(status).toBe("Success");
  //   // Check AccessToken
  //   expect(data).toHaveProperty("accessToken");
  //   expect(typeof data.accessToken).toBe("string");
  //   // Check RefreshToken
  //   const cookies = response.get("Set-Cookie") || []; // Set-Cookie is where Superset sets Cookies
  //   const hasRefreshToken = cookies.some((cookie) =>
  //     cookie.includes("refreshToken"),
  //   );
  //   expect(hasRefreshToken).toBe(true);
  //   const refreshCookie = cookies.find((c) => c.startsWith("refreshToken"));
  //   expect(refreshCookie).toMatch(/HttpOnly/i);
  //   expect(refreshCookie).toMatch(/Path=\/auth\/refresh/i);

  //   // Veryfy DB state directly with Prisma
  //   const user = await prismaMock.user.findUnique({
  //     where: { email: email },
  //   });
  //   if (response.status !== 201) {
  //     console.log("❌ Register Failed Error:", response.body);
  //   }
  //   expect(user).not.toBeNull();
  // });

  it("Should login a user and return tokens", async () => {
    console.log("typeof prisma.user.findUnique", typeof prisma.user.findUnique);
    console.log("prisma.user?", prisma.user);
    console.log("prisma.user.findUnique?", prisma.user.findUnique);
    // (prisma.user.findUnique as any).mockResolvedValue({ foo: "bar" });
    asMock(prisma.user.findUnique as any).mockResolvedValue(mockUser);
    // (
    //   prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>
    // ).mockResolvedValue(mockUser);
    // (bcrypt.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
    //   true,
    // );

    // SETUP THE MOCKS
    // prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
    // vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
    // vi.spyOn(bcrypt, "compare").mockResolvedValue(true as any)

    const response = await request(app).post("/auth/login").send({
      email: mockUser.email,
      password: "Password123",
    });

    console.log("Response Body:", response.body); // Check if 'User Found' log in controller changes
    expect(response.status).toBe(200);

    // expect(status).toBe("Success");
    // // Check AccessToken
    // expect(data).toHaveProperty("accessToken");
    // expect(typeof data.accessToken).toBe("string");
    // // Check RefreshToken
    // const cookies = response.get("Set-Cookie") || []; // Set-Cookie is where Superset sets Cookies
    // const hasRefreshToken = cookies.some((cookie) =>
    //   cookie.includes("refreshToken"),
    // );
    // expect(hasRefreshToken).toBe(true);
    // const refreshCookie = cookies.find((c) => c.startsWith("refreshToken"));
    // expect(refreshCookie).toMatch(/HttpOnly/i);
    // expect(refreshCookie).toMatch(/Path=\/auth\/refresh/i);

    // // Veryfy DB state directly with Prisma
    // const user = await prismaMock.user.findUnique({
    //   where: { email: email },
    // });
    // expect(user).not.toBeNull();
  });
});
