import { type FastifyPluginAsync, type FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ZodError, type ZodIssue } from "zod";
import { MutinyServerError, NotFoundError } from "@repo/error";
import { config } from "../config";

export const errorPlugin: FastifyPluginAsync = fp(
  async (app: FastifyInstance) => {
    app.setErrorHandler(async (error, _, reply) => {
      if (config.env.development || config.flags.forceLog) {
        app.log.error(error);
      }

      if (error instanceof ZodError) {
        const issue = error.issues[0] as ZodIssue;

        return reply.code(422).send({
          error: "validation",
          message: issue.message,
          field: issue.path.join("."),
        });
      } else if (error instanceof MutinyServerError) {
        return reply.code(error.statusCode).send(error.response);
      } else if (error.name === "FastifyError") {
        return reply.code(error.statusCode ?? 500).send({
          error: "fastify",
          code: error.code,
          message: error.message,
        });
      } else {
        return reply.code(500).send({
          error: "internal",
          message: "Unknown Error",
        });
      }
    });

    app.setNotFoundHandler(async (request, reply) => {
      const error = new NotFoundError(request.url);

      return reply.status(404).send(error.response);
    });
  },
);
