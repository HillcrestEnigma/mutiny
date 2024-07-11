import { FastifyPluginAsync, FastifyInstance } from "fastify";
import { ErrorResponse, ValidationErrorResponse } from "../schemas/error.ts";
import fp from "fastify-plugin";
import { ZodError, ZodIssue } from "zod";
import { AuthenticationError } from "./auth.ts";

export const errorPlugin: FastifyPluginAsync = fp(
  async (app: FastifyInstance) => {
    app.setErrorHandler(async (error, _, reply) => {
      let statusCode = 500;
      let response: ErrorResponse | ValidationErrorResponse = {
        error: "internal",
        message: "Internal server error.",
      };

      if (error instanceof ZodError) {
        const issue = error.issues[0] as ZodIssue;

        statusCode = 400;
        response = {
          error: "validation",
          message: issue.message,
          field: issue.path.join("."),
        };
      } else if (error instanceof AuthenticationError) {
        statusCode = 401;
        response = {
          error: "unauthorized",
          message: error.message,
        };
      } else {
        if (
          process.env.NODE_ENV === "development" ||
          process.env.FORCE_LOG === "1"
        ) {
          app.log.error(error);
        }
      }

      return reply.code(statusCode).send(response);
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
