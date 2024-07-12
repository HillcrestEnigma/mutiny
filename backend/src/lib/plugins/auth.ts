import {
  FastifyPluginAsync,
  FastifyInstance,
  preHandlerHookHandler,
} from "fastify";
import fp from "fastify-plugin";
import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import { lucia } from "../lucia";

import { User, Session } from "@repo/schema";
import { prisma } from "@repo/db";

declare module "fastify" {
  interface FastifyRequest {
    user: User | null;
    session: Session | null;
  }
  interface FastifyInstance {
    authRequired: { onRequest: preHandlerHookHandler };
  }
}

export class AuthenticationError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);

    this.name = "AuthenticationError";
  }
}

export const authPlugin: FastifyPluginAsync = fp(
  async (app: FastifyInstance) => {
    await app.register(fastifyAuth);

    app.addHook("onRequest", async (request) => {
      request.session = null;
      request.user = null;

      if (!request.headers.authorization) {
        return;
      }

      const sessionId = lucia.readBearerToken(request.headers.authorization);

      if (!sessionId) {
        return;
      }

      const { session } = await lucia.validateSession(sessionId);

      if (!session) {
        return;
      }

      const user = await prisma.user.findUnique({
        where: {
          id: session.userId,
        },
        include: {
          emails: true,
        },
      });

      if (!user) {
        return;
      }

      request.user = user;
      request.session = session;
      return;
    });

    const verifyAuthenticated: FastifyAuthFunction = async (request) => {
      if (!request.session || !request.user) {
        throw new AuthenticationError("User not authenticated");
      }
    };

    app.decorate("authRequired", {
      onRequest: app.auth([verifyAuthenticated]),
    });
  },
);
