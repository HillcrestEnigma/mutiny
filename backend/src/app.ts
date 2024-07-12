import Fastify, { FastifyServerOptions } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { errorPlugin } from "./lib/plugins/error";
import { infoRoutes } from "./routes/info";
import { userRoutes } from "./routes/user";
import { sessionRoutes } from "./routes/session";
import { authPlugin } from "./lib/plugins/auth";
import { setupPlugin } from "./lib/plugins/setup";

export async function build(opts: FastifyServerOptions = {}) {
  const app = Fastify(opts).withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(setupPlugin);
  await app.register(errorPlugin);
  await app.register(authPlugin);

  await app.register(infoRoutes);
  await app.register(userRoutes);
  await app.register(sessionRoutes);

  return app;
}
