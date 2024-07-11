import { FastifyInstance } from "fastify";
import {
  SignUpPayload,
  AuthSuccessResponse,
  AuthErrorResponse,
  UserDetailResponse,
} from "../lib/schemas/auth.ts";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as argon2 from "@node-rs/argon2";
import { lucia } from "../lib/lucia.ts";
import { ErrorResponse } from "../lib/schemas/error.ts";
import { prisma } from "../lib/prisma.ts";
import { generateIdFromEntropySize } from "lucia";

export const userRoutes: FastifyPluginAsyncZod = async (
  app: FastifyInstance,
) => {
  app.get(
    "/user",
    {
      schema: {
        response: {
          200: UserDetailResponse,
          default: ErrorResponse,
        },
      },
      ...app.authRequired,
    },
    async (request) => {
      return {
        message: `Details on authenticated user ${request.user?.username}`,
        session: request.session,
        user: request.user,
      };
    },
  );

  app.post(
    "/user",
    {
      schema: {
        body: SignUpPayload,
        response: {
          201: AuthSuccessResponse,
          default: AuthErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { username, email, password } = request.body as SignUpPayload;

      let user = await prisma.user.findFirst({
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

      const userId = generateIdFromEntropySize(10);
      const passwordHash = await argon2.hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      user = await prisma.user.create({
        data: {
          id: userId,
          username,
          emails: {
            create: {
              address: email,
              primary: true,
            },
          },
          passwordHash: passwordHash,
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
