import { build } from "../src/app";
import { beforeAll, afterAll } from "vitest";
import { prisma } from "@repo/db";

export const app = await build({
  logger: {
    level: "error",
    transport: {
      target: "pino-pretty",
    },
  },
});

beforeAll(async () => {
  await prisma.$connect();

  await prisma.$transaction([
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
    prisma.email.deleteMany(),
    prisma.profile.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
