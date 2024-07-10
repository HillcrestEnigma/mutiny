import Fastify, { FastifyServerOptions } from "fastify";
import { setupPlugin } from "./lib/plugins/setup.ts";
import {
  TypeBoxTypeProvider,
  TypeBoxValidatorCompiler,
} from "@fastify/type-provider-typebox";
import "./lib/formats.ts";
import { errorPlugin } from "./lib/plugins/error.ts";
import { infoRoutes } from "./routes/info.ts";
import { userRoutes } from "./routes/user.ts";
import { sessionRoutes } from "./routes/session.ts";

export async function build(opts: FastifyServerOptions = {}) {
  const app = Fastify(opts).withTypeProvider<TypeBoxTypeProvider>();
  app.setValidatorCompiler(TypeBoxValidatorCompiler);

  await app.register(errorPlugin);
  await app.register(setupPlugin);

  await app.register(infoRoutes);
  await app.register(userRoutes);
  await app.register(sessionRoutes);

  return app;
}
