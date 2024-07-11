import { z } from "zod";

const usernameRegex = /^[a-z][-a-z0-9_]*$/i;

export const Username = z
  .string()
  .min(3)
  .max(32)
  .refine((value) => usernameRegex.test(value));
export const EmailAddress = z.string().email().toLowerCase();
export const Password = z.string().min(8).max(128);

export const UsernameOrEmail = z.union([Username, EmailAddress]);
export const SessionId = z.string().length(40);
