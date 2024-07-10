import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    setupFiles: ["./setup.ts"],
    fileParallelism: false,
  },
});
