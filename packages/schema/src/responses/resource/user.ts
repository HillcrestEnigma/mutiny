import { GenericResponse } from "../meta/generic";
import { z } from "zod";
import { User } from "../../models/user";
import { SessionResponse } from "./session";

export const AuthenticatedUserResponse = GenericResponse.extend({
  user: User.required().omit({
    passwordHash: true,
  }),
}).describe("Authenticated User Response");
export type AuthenticatedUserResponse = z.infer<
  typeof AuthenticatedUserResponse
>;

export const UserCreateResponse = SessionResponse.describe(
  "Successful User Creation Response",
);
export type UserCreateResponse = SessionResponse;
