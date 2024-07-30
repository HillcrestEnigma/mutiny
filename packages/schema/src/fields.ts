import { z } from "zod";

const usernameRegex = /^[a-z][-a-z0-9_]*$/i;

export const Username = z
  .string()
  .min(3)
  .max(32)
  .refine((value) => usernameRegex.test(value), { message: "Invalid" })
  .describe("Username");
export const EmailAddress = z
  .string()
  .email()
  .toLowerCase()
  .describe("Email Address");
export const Password = z.string().min(8).max(128).describe("Password");

export const UsernameOrEmail = z
  .union([Username, EmailAddress])
  .describe("Username or Email Address");
export const SessionId = z.string().length(40).describe("Session ID");

export const ErrorType = z.enum([
  "badrequest", // 400
  "unauthorized", // 401
  "forbidden", // 403
  "notfound", // 404
  "conflict", // 409
  "validation", // 422
  "internal", // 500
  "fastify", // Fastify Error
]);
export type ErrorType = z.infer<typeof ErrorType>;
