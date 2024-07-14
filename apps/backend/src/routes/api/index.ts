import { type FastifyInstance } from "fastify";
import { sessionRoutes } from "./session";
import { userRoutes } from "./user";
import { config } from "../../lib/config";
import { APIInfoResponse } from "@repo/schema";

export async function apiRoutes(app: FastifyInstance) {
  app.register(userRoutes);
  app.register(sessionRoutes);

  app.get(
    "/",
    {
      schema: {
        summary: "Get API Information",
        description: "Information on this API server.",
        tags: ["meta"],
        response: {
          200: APIInfoResponse,
        },
      },
    },
    async () => {
      return {
        version: config.info.version,
      };
    },
  );
}
