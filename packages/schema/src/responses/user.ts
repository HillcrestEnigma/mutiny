import { GenericResponse } from "./generic";
import { z } from "zod";
import { User } from "../models/user";
import { Session } from "../models/session";

export const AuthenticatedUserResponse = GenericResponse.and(
  z.object({
    session: Session,
    user: User,
  }),
);
export type AuthenticatedUserResponse = z.infer<
  typeof AuthenticatedUserResponse
>;
