import { prisma, Prisma } from "../prisma.ts";
import { Email } from "../schemas/auth.ts";

export const emailModel = {
  create: async (data: Email, opts?: Prisma.EmailCreateArgs) => {
    return await prisma.email.create({
      data,
      ...opts,
    });
  },
  listByUserId: async (userId: string, opts?: Prisma.EmailFindManyArgs) => {
    console.log(userId);
    return await prisma.email.findMany({
      where: {
        userId,
      },
      ...opts,
    });
  },
  findByAddress: async (address: string, opts?: Prisma.EmailFindUniqueArgs) => {
    return await prisma.email.findUnique({
      where: {
        address,
      },
      ...opts,
    });
  },
};
