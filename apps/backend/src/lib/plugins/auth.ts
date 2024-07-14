import {
  type FastifyPluginAsync,
  type FastifyInstance,
  type preHandlerHookHandler,
} from "fastify";
import fp from "fastify-plugin";
import fastifyAuth, { type FastifyAuthFunction } from "@fastify/auth";
import { lucia } from "../lucia";
import { User, Session } from "@repo/schema";
import { prisma } from "@repo/db";
import { UnauthorizedError } from "../errors";

declare module "fastify" {
  interface FastifyRequest {
    user: User | null;
    session: Session | null;
  }
  interface FastifyInstance {
    authRequired: { onRequest: preHandlerHookHandler };
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
        throw new UnauthorizedError();
      }
    };

    app.decorate("authRequired", {
      onRequest: app.auth([verifyAuthenticated]),
    });
  },
);
