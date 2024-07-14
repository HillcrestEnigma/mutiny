import { type FastifyPluginAsync, type FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { fastifySwagger } from "@fastify/swagger";
import fastifyScalar from "@scalar/fastify-api-reference";
import { config } from "../config";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const openapiPlugin: FastifyPluginAsync = fp(
  async (app: FastifyInstance) => {
    // @ts-expect-error: Use Scalar Extensions to the OpenAPI Spec (x-displayName)
    app.register(fastifySwagger, {
      openapi: {
        openapi: "3.1.0",
        info: config.info,
        servers: [{ url: config.endpoints.api }],
        tags: [
          {
            name: "meta",
            "x-displayName": "Meta",
            description: "Endpoints for information on this API",
          },
          {
            name: "user",
            "x-displayName": "User",
            description: "User-related Endpoints",
          },
          {
            name: "session",
            "x-displayName": "Session",
            description: "Session-related Endpoints",
          },
        ],
        components: {
          securitySchemes: {
            session: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "Session",
              description: "Session Token of the Authenticated User",
            },
          },
        },
      },
      transform: jsonSchemaTransform,
    });
    // TODO: Should investigate later on how to best add components.schemas models
    // It could be helpful to skip zod-type-provider's jsonSchemTransform and use
    // zod-to-json-schema directly to manage JSONSchema models directly

    app.register(fastifyScalar, {
      routePrefix: "/docs",
      configuration: {
        theme: "solarized",
      },
    });
  },
);
