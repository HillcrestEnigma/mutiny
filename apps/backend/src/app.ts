import Fastify, { type FastifyServerOptions } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { errorPlugin } from "./lib/plugins/error";
import { apiRoutes } from "./routes/api";
import { authPlugin } from "./lib/plugins/auth";
import { setupPlugin } from "./lib/plugins/setup";
import { openapiPlugin } from "./lib/plugins/openapi";

export async function build(options: FastifyServerOptions = {}) {
  const app = Fastify(options).withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(setupPlugin);
  await app.register(errorPlugin);
  await app.register(authPlugin);
  await app.register(openapiPlugin);

  await app.register(apiRoutes, {
    prefix: "/api",
  });

  return app;
}
