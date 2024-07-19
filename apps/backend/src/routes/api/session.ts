import { type FastifyInstance } from "fastify";
import {
  SessionCreatePayload,
  SessionResponse,
  SessionDeletePayload,
  GenericResponse,
  AuthenticatedSessionResponse,
  ValidationErrorResponse,
  UnauthorizedErrorResponse,
  FastifyErrorResponse,
} from "@repo/schema";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { lucia } from "../../lib/lucia";
import { prisma } from "@repo/db";
import { verifyPassword } from "../../lib/utils/auth";
import { UnauthorizedError } from "@repo/error";

export const sessionRoutes: FastifyPluginAsyncZod = async (
  app: FastifyInstance,
) => {
  app.get(
    "/session",
    {
      schema: {
        summary: "Get Authenticated Session",
        description: "Get details on the authenticated session.",
        tags: ["session"],
        security: [
          {
            session: [],
          },
        ],
        response: {
          200: AuthenticatedSessionResponse,
          401: UnauthorizedErrorResponse,
          422: ValidationErrorResponse,
          default: FastifyErrorResponse,
        },
      },
      ...app.authRequired,
    },
    async (request) => {
      return {
        session: request.session,
      };
    },
  );

  app.post(
    "/session",
    {
      schema: {
        summary: "Create Session",
        description: "Sign in an existing user.",
        tags: ["session"],
        body: SessionCreatePayload,
        response: {
          201: SessionResponse,
          401: UnauthorizedErrorResponse,
          422: ValidationErrorResponse,
          default: FastifyErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { usernameOrEmail, password } =
        request.body as SessionCreatePayload;

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
        throw new UnauthorizedError("Invalid credentials.");
      }

      const validPassword = await verifyPassword(user.passwordHash, password);

      if (!validPassword) {
        throw new UnauthorizedError("Invalid credentials.");
      }

      const session = await lucia.createSession(user.id, {});

      reply.code(201);
      return {
        sessionId: session.id,
      };
    },
  );

  app.delete(
    "/session",
    {
      schema: {
        summary: "Delete Session",
        description: "Sign out a logged-in user.",
        tags: ["session"],
        body: SessionDeletePayload,
        response: {
          200: GenericResponse,
          422: ValidationErrorResponse,
          default: FastifyErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { sessionId } = request.body as SessionDeletePayload;

      await lucia.invalidateSession(sessionId);

      reply.code(200);
      return {};
    },
  );
};
