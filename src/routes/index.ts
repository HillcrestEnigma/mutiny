import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.ts";
import { infoRoutes } from "./info.ts";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

export const apiRoutes: FastifyPluginAsyncTypebox = async (
  app: FastifyInstance,
) => {
  app.register(infoRoutes);
  app.register(authRoutes);
};
