import { FastifyInstance } from "fastify";
import {
  SignUpPayload,
  AuthSuccessResponse,
  AuthErrorResponse,
} from "../lib/schemas/auth.ts";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { crud } from "../lib/crud/index.ts";
import { generateIdFromEntropySize } from "lucia";
import * as argon2 from "@node-rs/argon2";
import { lucia } from "../lib/plugins/setup.ts";

export const userRoutes: FastifyPluginAsyncZod = async (
  app: FastifyInstance,
) => {
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

      const user = await crud.user.find({ username, email });

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

      await crud.user.create({ userId, username, email, passwordHash });

      const session = await lucia.createSession(userId, {});

      reply.code(201);
      return {
        sessionId: session.id,
        message: "Successfully created user.",
      };
    },
  );
};
