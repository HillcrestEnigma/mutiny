import { Prisma } from "@prisma/client";
import { prisma } from "../plugins/setup.ts";

export const profileMethods = {
  create: async (
    data: {
      userId: string;
      username: string;
      email: string;
      passwordHash: string;
    },
    opts?: Prisma.UserCreateArgs,
  ) => {
    return await prisma.user.create({
      data: {
        id: data.userId,
        username: data.username,
        emails: {
          create: {
            address: data.email,
            primary: true,
          },
        },
        passwordHash: data.passwordHash,
      },
      ...opts,
    });
  },
  find: async (
    data: {
      username?: string;
      email?: string;
    },
    opts?: Prisma.UserFindFirstArgs,
  ) => {
    const orQuery = [];

    if (data.username) {
      orQuery.push({
        username: data.username,
      });
    }

    if (data.email) {
      orQuery.push({
        emails: {
          some: {
            address: data.email,
          },
        },
      });
    }

    if (orQuery.length === 0) {
      return null;
    }

    return await prisma.user.findFirst({
      where: { OR: orQuery },
      ...opts,
    });
  },
};
