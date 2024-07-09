import { FastifyInstance } from "fastify";

export async function infoRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const name = process.env.NAME || "not specified";
    const version = process.env.npm_package_version || "0.0.0";

    return { name, version };
  });
}
