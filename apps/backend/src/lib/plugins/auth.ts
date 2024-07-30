import {
  type FastifyPluginAsync,
  type FastifyInstance,
  type preHandlerHookHandler,
} from "fastify";
import fp from "fastify-plugin";
import fastifyAuth, { type FastifyAuthFunction } from "@fastify/auth";
import { lucia } from "../lucia";
import { User, Session, type Profile } from "@repo/schema";
import { prisma } from "@repo/db";
import { UnauthorizedError } from "@repo/error";

declare module "fastify" {
  interface AuthenticatedRequestData {
    user?: Required<User>;
    session?: Required<Session>;
    profile?: Required<Profile>;
  }

  interface FastifyRequest extends AuthenticatedRequestData {}

  interface FastifyInstance {
    authRequired: { onRequest: preHandlerHookHandler };
  }
}

export const authPlugin: FastifyPluginAsync = fp(
  async (app: FastifyInstance) => {
    await app.register(fastifyAuth);

    app.addHook("onRequest", async (request) => {
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

      const profile = await prisma.profile.findUnique({
        where: {
          userId: session.userId,
        },
      });

      request.user = user;
      request.session = session;
      if (profile) {
        request.profile = profile;
      }

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
