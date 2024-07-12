import { z } from "zod";
import { Username, EmailAddress } from "../fields";

export const Email = z.object({
  id: z.number(),
  userId: z.string(),
  address: EmailAddress,
  verified: z.boolean(),
  primary: z.boolean(),
});
export type Email = z.infer<typeof Email>;

export const User = z.object({
  id: z.string(),
  username: Username,
  emails: Email.array(),
});
export type User = z.infer<typeof User>;
