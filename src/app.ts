import Fastify, { FastifyServerOptions } from "fastify";
import { setupPlugin } from "./lib/plugins/setup.ts";
import {
  TypeBoxTypeProvider,
  TypeBoxValidatorCompiler,
} from "@fastify/type-provider-typebox";
import "./lib/formats.ts";
import { errorPlugin } from "./lib/plugins/error.ts";
import { apiRoutes } from "./routes";

export function build(opts: FastifyServerOptions = {}) {
  const app = Fastify(opts).withTypeProvider<TypeBoxTypeProvider>();
  app.setValidatorCompiler(TypeBoxValidatorCompiler);

  app.register(errorPlugin);

  app.register(setupPlugin);
  app.register(apiRoutes);

  return app;
}
