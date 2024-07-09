import { FastifyInstance } from "fastify";
import { SignUpPayload, AuthResponseBody } from "../lib/schemas";
import { auth } from "../lib/auth.ts";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

export const authRoutes: FastifyPluginAsyncTypebox = async (
  app: FastifyInstance,
) => {
  app.post(
    "/users",
    {
      schema: {
        body: SignUpPayload,
        response: {
          "2xx": AuthResponseBody,
        },
      },
    },
    async (request, reply) => {
      const { username, email, password } = request.body as SignUpPayload;

      const [statusCode, response] = await auth.signup(
        username,
        email,
        password,
      );

      return reply.status(statusCode).send(response);
    },
  );
};
