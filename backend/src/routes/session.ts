import { FastifyInstance } from "fastify";
import {
  SessionCreatePayload,
  SessionResponse,
  SessionDeletePayload,
  ErrorResponse,
  GenericResponse,
} from "@repo/schema";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as argon2 from "@node-rs/argon2";
import { lucia } from "../lib/lucia";
import { prisma } from "@repo/db";

export const sessionRoutes: FastifyPluginAsyncZod = async (
  app: FastifyInstance,
) => {
  app.post(
    "/session",
    {
      schema: {
        body: SessionCreatePayload,
        response: {
          201: SessionResponse,
          default: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { usernameOrEmail, password } =
        request.body as SessionCreatePayload;

      const userNotFoundResponse: ErrorResponse = {
        message: "Incorrect credentials.",
        error: "forbidden",
      };

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: usernameOrEmail },
            {
              emails: {
                some: {
                  address: usernameOrEmail,
                },
              },
            },
          ],
        },
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

  app.delete(
    "/session",
    {
      schema: {
        body: SessionDeletePayload,
        response: {
          200: GenericResponse,
          default: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { sessionId } = request.body as SessionDeletePayload;

      await lucia.invalidateSession(sessionId);

      reply.code(200);
      return {
        message: "Successfully invalidated session.",
      };
    },
  );
};
