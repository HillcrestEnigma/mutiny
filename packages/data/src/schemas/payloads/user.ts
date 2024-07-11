import { z } from "zod";
import { Username, EmailAddress, Password } from "../fields";

export const UserCreatePayload = z.object({
  username: Username,
  email: EmailAddress,
  password: Password,
});
export type UserCreatePayload = z.infer<typeof UserCreatePayload>;
