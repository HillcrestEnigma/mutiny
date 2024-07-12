import { GenericResponse } from "./generic";
import { z } from "zod";
import { User } from "../models/user";

export const AuthenticatedUserResponse = GenericResponse.and(
  z.object({
    user: User.required().omit({
      passwordHash: true,
    }),
  }),
);
export type AuthenticatedUserResponse = z.infer<
  typeof AuthenticatedUserResponse
>;
