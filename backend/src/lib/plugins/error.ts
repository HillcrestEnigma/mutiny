import { FastifyPluginAsync, FastifyInstance } from "fastify";
import { ErrorResponse, ValidationErrorResponse } from "../schemas/error.ts";
import fp from "fastify-plugin";

export const errorPlugin: FastifyPluginAsync = fp(
  async (app: FastifyInstance) => {
    app.setSchemaErrorFormatter((errors, dataVar) => {
      const error = errors[0];
      const field = `${dataVar}${error.instancePath}`;

      return new Error(`${field}: ${error.message}.`);
      // return {
      //   error: 'validation',
      //   message: `${field}: ${error.message}.`,
      //   field,
      // }
    });

    app.setErrorHandler(async (error, _, reply) => {
      let statusCode = 500;
      let response: ErrorResponse | ValidationErrorResponse = {
        error: "internal",
        message: "Internal server error.",
      };

      if (error.validation) {
        const validationError = error.validation[0];
        const field = `${error.validationContext}${validationError.instancePath}`;

        statusCode = 400;
        response = {
          ...response,
          message: error.message,
          error: "validation",
          field,
        };
      } else {
        app.log.error(error);
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
