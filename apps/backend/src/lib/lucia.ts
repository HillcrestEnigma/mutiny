import { Lucia } from "lucia";
import { User } from "@repo/schema";
import { prisma } from "@repo/db";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<User, "emails">;
  }
}

export const lucia = new Lucia(adapter, {
  getUserAttributes: async (attrs) => {
    return {
      username: attrs.username,
    };
  },
});
