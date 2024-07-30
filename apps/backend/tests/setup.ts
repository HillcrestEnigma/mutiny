import { prisma } from "@repo/db";
import type { GlobalSetupContext } from "vitest/node";
import { scenario, bakeScenario } from "./utils/scenario";

declare module "vitest" {
  export interface ProvidedContext {
    scenario: typeof scenario;
  }
}

export const setup = async ({ provide }: GlobalSetupContext) => {
  await prisma.$connect();

  await bakeScenario();

  provide("scenario", scenario);
};

export const tearDown = async () => {
  await prisma.$disconnect();
};
