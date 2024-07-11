import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { User } from "./schemas/auth";
import { prisma } from "./prisma.ts";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<User, "emails">;
  }
}

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  getUserAttributes: async (attrs) => {
    return {
      username: attrs.username,
    };
  },
});
