import { z } from "zod";
import { Username, EmailAddress, NumberId, StringId } from "../fields";

export const Email = z.object({
  id: NumberId.optional(),
  userId: StringId.optional(),
  address: EmailAddress,
  verified: z.boolean().default(false).optional(),
  primary: z.boolean().optional(),
});
export type Email = z.infer<typeof Email>;

export const User = z.object({
  id: StringId.optional(),
  username: Username,
  emails: Email.array().optional(),
  passwordHash: z.string().optional(),
});
export type User = z.infer<typeof User>;
