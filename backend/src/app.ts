import Fastify, { FastifyServerOptions } from "fastify";
import { setupPlugin } from "./lib/plugins/setup.ts";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { errorPlugin } from "./lib/plugins/error.ts";
import { infoRoutes } from "./routes/info.ts";
import { userRoutes } from "./routes/user.ts";
import { sessionRoutes } from "./routes/session.ts";

export async function build(opts: FastifyServerOptions = {}) {
  const app = Fastify(opts).withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(errorPlugin);
  await app.register(setupPlugin);

  await app.register(infoRoutes);
  await app.register(userRoutes);
  await app.register(sessionRoutes);

  return app;
}
