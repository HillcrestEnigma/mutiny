import { prisma } from "@repo/db";
import type { GlobalSetupContext } from "vitest/node";
import { scenario } from "./scenario";

declare module "vitest" {
  export interface ProvidedContext {
    scenario: typeof scenario;
  }
}

export const setup = async ({ provide }: GlobalSetupContext) => {
  await prisma.$connect();

  provide("scenario", scenario);
};

export const tearDown = async () => {
  await prisma.$disconnect();
};
