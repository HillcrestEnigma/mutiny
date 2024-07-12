import { FastifyInstance } from "fastify";
import { sessionRoutes } from "./session";
import { userRoutes } from "./user";
import { config } from "../../lib/config";

export async function apiRoutes(app: FastifyInstance) {
  app.register(userRoutes);
  app.register(sessionRoutes);

  app.get("/", async () => {
    return { version: config.version };
  });
}
