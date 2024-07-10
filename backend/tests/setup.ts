import { beforeEach, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { build } from "../src/app";

export const prisma = new PrismaClient();

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
});

beforeEach(async () => {
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
