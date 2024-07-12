import { FastifyInstance } from "fastify";
import {
  UserCreatePayload,
  SessionResponse,
  ErrorResponse,
  AuthenticatedUserResponse,
} from "@repo/schema";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { lucia } from "../../lib/lucia";
import { prisma } from "@repo/db";
import { generateUserId, hashPassword } from "../../lib/utils/auth";

export const userRoutes: FastifyPluginAsyncZod = async (
  app: FastifyInstance,
) => {
  app.get(
    "/user",
    {
      schema: {
        response: {
          200: AuthenticatedUserResponse,
          default: ErrorResponse,
        },
      },
      ...app.authRequired,
    },
    async (request) => {
      return {
        message: `Details on authenticated user "${request.user?.username}".`,
        user: request.user,
      };
    },
  );

  app.post(
    "/user",
    {
      schema: {
        body: UserCreatePayload,
        response: {
          201: SessionResponse,
          default: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { username, email, password } = request.body as UserCreatePayload;

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            {
              emails: {
                some: {
                  address: email,
                },
              },
            },
          ],
        },
      });

      if (user) {
        reply.code(401);
        return {
          message: "User already exists.",
          error: "forbidden",
        };
      }

      const userId = generateUserId();
      const passwordHash = await hashPassword(password);

      await prisma.user.create({
        data: {
          id: userId,
          username,
          emails: {
            create: {
              address: email,
              primary: true,
            },
          },
          passwordHash,
        },
      });

      const session = await lucia.createSession(userId, {});

      reply.code(201);
      return {
        sessionId: session.id,
        message: "Successfully created user.",
      };
    },
  );
};
