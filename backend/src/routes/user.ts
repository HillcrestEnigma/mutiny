import { FastifyInstance } from "fastify";
import {
  UserCreatePayload,
  SessionResponse,
  ErrorResponse,
  AuthenticatedUserResponse,
} from "@repo/data/schemas";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as argon2 from "@node-rs/argon2";
import { lucia } from "../lib/lucia";
import { generateIdFromEntropySize } from "lucia";
import { db } from "@repo/data/db";
import { users, emails } from "@repo/data/tables";
import { eq, or } from "@repo/data/drizzle";

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
        body: UserCreatePayload,
        response: {
          201: SessionResponse,
          default: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      const { username, email, password } = request.body as UserCreatePayload;

      const conflictingUsers = await db
        .selectDistinct()
        .from(users)
        .leftJoin(emails, eq(users.id, emails.userId))
        .where(or(eq(users.username, username), eq(emails.address, email)))
        .limit(1);

      if (conflictingUsers.length > 0) {
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

      await db.transaction(async (tx) => {
        await tx.insert(users).values({
          id: userId,
          username,
          passwordHash,
        });

        await tx.insert(emails).values({
          userId,
          address: email,
          primary: true,
        });
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
