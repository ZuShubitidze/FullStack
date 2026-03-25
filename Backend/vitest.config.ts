// /Backend/vitest.config.ts
import path from "path";
import dotenv from "dotenv";
import { defineProject } from "vitest/config";

// Load test env for this specific project
dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default defineProject({
  test: {
    name: "backend",
    globals: true,
    environment: "node",
    setupFiles: ["./src/tests/setup.ts"],
    alias: {
      "@lib": path.resolve(__dirname, "./src/lib"),
    },
    // Explicitly disable browser to kill the "browser.instances" error
    browser: {
      enabled: false,
    },
  },
});
