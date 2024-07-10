import { FastifyInstance } from "fastify";
import {
  SignInPayload,
  AuthSuccessResponse,
  SignOutPayload,
  AuthErrorResponse,
} from "../lib/schemas/auth.ts";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { crud } from "../lib/crud/index.ts";
import * as argon2 from "@node-rs/argon2";
import { lucia } from "../lib/plugins/setup.ts";

export const sessionRoutes: FastifyPluginAsyncTypebox = async (
  app: FastifyInstance,
) => {
  app.post(
    "/session",
    {
      schema: {
        body: SignInPayload,
        response: {
          200: AuthSuccessResponse,
          default: AuthErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { usernameOrEmail, password } = request.body as SignInPayload;

      const userNotFoundResponse: AuthErrorResponse = {
        message: "Incorrect credentials.",
        error: "forbidden",
      };

      const user = await crud.user.find({
        username: usernameOrEmail,
        email: usernameOrEmail,
      });

      if (!user) {
        reply.code(401);
        return userNotFoundResponse;
      }

      const validPassword = await argon2.verify(user.passwordHash, password);

      if (!validPassword) {
        reply.code(401);
        return userNotFoundResponse;
      }

      const session = await lucia.createSession(user.id, {});

      reply.code(201);
      return {
        message: "Successfully created session.",
        sessionId: session.id,
      };
    },
  );

  app.delete("/session", async (request, reply) => {
    const { sessionId } = request.body as SignOutPayload;

    await lucia.invalidateSession(sessionId);

    reply.code(200);
    return {
      message: "Successfully invalidated session.",
    };
  });
};
