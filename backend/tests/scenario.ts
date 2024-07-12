import { generateUserId, hashPassword } from "../src/lib/utils/auth";
import { Email, Session, User } from "@repo/schema";
import { prisma } from "@repo/db";

type ScenarioPlanUser = User & {
  emails: (Partial<Email> & {
    address: string;
    primary: boolean;
  })[];
  sessions: (Partial<Session> & {
    id: string;
    expiresAt: Date;
  })[];
};

type ScenarioUser = ScenarioPlanUser & {
  password: string;
};

const scenarioPlan: {
  users: ScenarioPlanUser[];
} = {
  users: [
    {
      username: "existing_user",
      emails: [
        {
          address: "existing_user@example.com",
          primary: true,
        },
      ],
      sessions: [
        {
          id: "A".repeat(40),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      ],
    },
  ],
};

export const scenario: {
  users: ScenarioUser[];
} = {
  users: scenarioPlan.users.map((user: ScenarioPlanUser) => {
    return {
      ...user,
      password: "password",
    };
  }),
};

const passwordHash = await hashPassword("password");

await Promise.all(
  scenario.users.map(async (user) => {
    const userId = generateUserId();

    return prisma.user.create({
      data: {
        id: userId,
        username: user.username,
        passwordHash,
        emails: {
          create: user.emails,
        },
        sessions: {
          create: user.sessions,
        },
      },
    });
  }),
);
