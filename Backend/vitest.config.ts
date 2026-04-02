import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // This allows you to use 'describe', 'it', 'expect' without importing them
    environment: "node",
    setupFiles: ["./src/tests/setup.ts"],
    // alias: {
    //   // Direct alias for the prisma file to avoid path confusion
    //   "@lib/prisma": new URL("./src/lib/prisma.ts", import.meta.url).pathname,
    // },
    alias: {
      "@lib/prisma": "./src/lib/prisma.ts",
    },
    // include: ["tests/**/*.test.ts", "tests/*.ts", "./tests/**.ts"],
    exclude: ["node_modules"],
  },
});
