import { type FastifyPluginAsync, type FastifyInstance } from "fastify";
import { ErrorResponse } from "@repo/schema";
import fp from "fastify-plugin";
import { ZodError, type ZodIssue } from "zod";
import { MutinyError } from "../errors";
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
      } else if (error instanceof MutinyError) {
        return reply.code(error.statusCode).send({
          error: error.errorType,
          message: error.message,
          ...error.response,
        });
      } else {
        return reply.code(500).send({
          error: "internal",
          message: "Unknown Error",
        });
      }
    });

    app.setNotFoundHandler(async (request, reply) => {
      const response: ErrorResponse = {
        message: `${request.url} not found.`,
        error: "notfound",
      };

      return reply.status(404).send(response);
    });
  },
);
