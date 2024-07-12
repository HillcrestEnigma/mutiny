import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    globalSetup: ["./setup.ts"],
    fileParallelism: false,
  },
});
