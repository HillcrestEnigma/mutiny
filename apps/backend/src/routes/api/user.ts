import { FastifyInstance } from "fastify";
import {
  UserCreatePayload,
  SessionResponse,
  ValidationErrorResponse,
  AuthenticatedUserResponse,
  GenericErrorResponse,
  ConflictErrorResponse,
  UnauthorizedErrorResponse,
} from "@repo/schema";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { lucia } from "../../lib/lucia";
import { prisma } from "@repo/db";
import { generateUserId, hashPassword } from "../../lib/utils/auth";
import { ConflictError } from "../../lib/errors";

export const userRoutes: FastifyPluginAsyncZod = async (
  app: FastifyInstance,
) => {
  app.get(
    "/user",
    {
      schema: {
        summary: "Get Authenticated User",
        description: "Get details on the authenticated user.",
        tags: ["user"],
        security: [
          {
            session: [],
          },
        ],
        response: {
          200: AuthenticatedUserResponse,
          422: ValidationErrorResponse,
          default: GenericErrorResponse,
        },
      },
      ...app.authRequired,
    },
    async (request) => {
      return {
        user: request.user,
      };
    },
  );

  app.post(
    "/user",
    {
      schema: {
        summary: "Create User",
        description: "Sign up a new user.",
        tags: ["user"],
        body: UserCreatePayload,
        response: {
          201: SessionResponse,
          401: UnauthorizedErrorResponse,
          409: ConflictErrorResponse,
          422: ValidationErrorResponse,
          default: GenericErrorResponse,
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
        let resource;

        if (user.username == username) {
          resource = "username";
        } else {
          resource = "email";
        }

        throw new ConflictError(resource);
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
      };
    },
  );
};