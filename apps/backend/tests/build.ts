import { build } from "../src/app";

export const app = await build({
  logger: {
    level: "error",
    transport: {
      target: "pino-pretty",
    },
  },
});
