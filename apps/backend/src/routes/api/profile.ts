import { type FastifyInstance } from "fastify";
import {
  ValidationErrorResponse,
  FastifyErrorResponse,
  UnauthorizedErrorResponse,
  AuthenticatedProfileResponse,
  ProfileUpsertPayload,
  NotFoundErrorResponse,
  CreatedResponse,
  UpdatedResponse,
} from "@repo/schema";
import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "@repo/db";
import { NotFoundError } from "@repo/error";

export const profileRoutes: FastifyPluginAsyncZod = async (
  app: FastifyInstance,
) => {
  app.get(
    "/profile",
    {
      schema: {
        summary: "Get Authenticated Profile",
        description: "Get details on the authenticated user's profile.",
        tags: ["profile"],
        security: [
          {
            session: [],
          },
        ],
        response: {
          200: AuthenticatedProfileResponse,
          401: UnauthorizedErrorResponse,
          404: NotFoundErrorResponse,
          default: FastifyErrorResponse,
        },
      },
      ...app.authRequired,
    },
    async (request) => {
      if (!request.profile) {
        throw new NotFoundError("profile");
      }

      return {
        profile: request.profile,
      };
    },
  );

  app.put(
    "/profile",
    {
      schema: {
        summary: "Upsert Authenticated Profile",
        description: "Upsert a profile for the authenticated user",
        tags: ["profile"],
        security: [
          {
            session: [],
          },
        ],
        body: ProfileUpsertPayload,
        response: {
          201: CreatedResponse,
          204: UpdatedResponse,
          401: UnauthorizedErrorResponse,
          422: ValidationErrorResponse,
          default: FastifyErrorResponse,
        },
      },
      ...app.authRequired,
    },
    async (request, reply) => {
      const body = request.body as ProfileUpsertPayload;

      // TODO: Find ways to avoid this type guard
      if (!request.user) return;

      const profile = await prisma.profile.findUnique({
        where: {
          userId: request.user.id,
        },
        select: { id: true },
      });

      await prisma.profile.upsert({
        where: {
          userId: request.user.id,
        },
        update: body,
        create: {
          userId: request.user.id,
          ...body,
        },
      });

      if (profile) {
        reply.code(204);
      } else {
        reply.code(201);
      }

      return {};
    },
  );
};
