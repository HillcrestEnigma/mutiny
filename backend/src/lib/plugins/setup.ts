import { FastifyPluginAsync, FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { prisma } from "../prisma.ts";

export const setupPlugin: FastifyPluginAsync = fp(
  async (app: FastifyInstance) => {
    await prisma.$connect();

    app.addHook("onClose", async () => {
      await prisma.$disconnect();
    });
  },
);
