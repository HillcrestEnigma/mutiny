import { generateUserId, hashPassword } from "../../src/lib/utils/auth";
import { Email, Session, User, type Profile } from "@repo/schema";
import { prisma } from "@repo/db";

type ScenarioPlanUser = User & {
  emails: (Email & {
    primary: boolean;
  })[];
  sessions: (Session & {
    expiresAt: Date;
  })[];
  profile?: Profile;
};

type ScenarioUser = ScenarioPlanUser & {
  password: string;
};

const scenarioPlan: {
  users: ScenarioPlanUser[];
} = {
  users: [
    {
      username: "existing_user_1",
      emails: [
        {
          address: "existing_user_1@example.com",
          primary: true,
        },
      ],
      sessions: [
        {
          id: "A".repeat(40),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      ],
      profile: {
        name: "Existing User 1",
        bio: "This is an existing user.",
        birthday: new Date(2000, 1, 1),
      },
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

export const bakeScenario = async () => {
  const passwordHash = await hashPassword("password");

  await prisma.$transaction([prisma.user.deleteMany()]);

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
          profile: {
            create: user.profile,
          },
        },
      });
    }),
  );
};
