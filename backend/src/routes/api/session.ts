import { FastifyInstance } from "fastify";
import {
  SessionCreatePayload,
  SessionResponse,
  SessionDeletePayload,
  ErrorResponse,
  GenericResponse,
  AuthenticatedSessionResponse,
} from "@repo/schema";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { lucia } from "../../lib/lucia";
import { prisma } from "@repo/db";
import { verifyPassword } from "../../lib/utils/auth";

export const sessionRoutes: FastifyPluginAsyncZod = async (
  app: FastifyInstance,
) => {
  app.get(
    "/session",
    {
      schema: {
        response: {
          200: AuthenticatedSessionResponse,
          default: ErrorResponse,
        },
      },
      ...app.authRequired,
    },
    async (request) => {
      return {
        message: "Details on authenticated session.",
        session: request.session,
      };
    },
  );

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

      const validPassword = await verifyPassword(user.passwordHash, password);

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
