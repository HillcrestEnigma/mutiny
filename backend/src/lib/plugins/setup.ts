import { FastifyPluginAsync, FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    lucia: Lucia;
  }
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}

interface User {
  username: string;
  emails: Email[];
}

interface Email {
  address: string;
  verified: boolean;
  primary: boolean;
}

export const prisma = new PrismaClient();

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attrs) => {
    return {
      username: attrs.username,
      emails: attrs.emails,
    };
  },
});

export const setupPlugin: FastifyPluginAsync = fp(
  async (app: FastifyInstance) => {
    await prisma.$connect();

    app.addHook("onClose", async (fastify) => {
      await fastify.prisma.$disconnect();
    });
  },
);
