import { z } from "zod";
import { UserCreatePayload } from "../payloads/user";
import { Password } from "../fields";

export const UserCreateForm = UserCreatePayload.extend({
  passwordConfirmation: Password,
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});
export type UserCreateForm = z.infer<typeof UserCreateForm>;
