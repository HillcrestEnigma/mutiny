import {
  FastifyPluginAsync,
  FastifyInstance,
  preHandlerHookHandler,
} from "fastify";
import fp from "fastify-plugin";
import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import { lucia } from "../lucia.ts";
import { User, Session } from "../schemas/auth";
import { prisma } from "../prisma.ts";

declare module "fastify" {
  interface FastifyRequest {
    session: Session | null;
    user: User | null;
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

      request.session = session;
      request.user = user;
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
