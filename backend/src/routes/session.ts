import { FastifyInstance } from "fastify";
import {
  SessionCreatePayload,
  SessionResponse,
  SessionDeletePayload,
  ErrorResponse,
  GenericResponse,
} from "@repo/data/schemas";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as argon2 from "@node-rs/argon2";
import { lucia } from "../lib/lucia";
import { db } from "@repo/data/db";
import { eq, or } from "@repo/data/drizzle";
import { emails, users } from "@repo/data/tables";

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

      const user = (
        await db
          .selectDistinct()
          .from(users)
          .leftJoin(emails, eq(users.id, emails.userId))
          .where(
            or(
              eq(users.username, usernameOrEmail),
              eq(emails.address, usernameOrEmail),
            ),
          )
          .limit(1)
      )[0].users;

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
