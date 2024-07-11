import { Lucia } from "lucia";
import { User } from "@repo/data/schemas";

import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@repo/data/db";
import { sessions, users } from "@repo/data/tables";

export const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

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
