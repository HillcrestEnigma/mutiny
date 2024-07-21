import { beforeAll, afterAll } from "bun:test";
import { build } from "@repo/backend";
import { createClient } from "./client";

const app = await build({
  logger: {
    level: "fatal",
    transport: {
      target: "pino-pretty",
    },
  },
});

beforeAll(async () => {
  await app.listen({ port: 4000 });

  createClient();
});

afterAll(async () => {
  await app.close();
});
