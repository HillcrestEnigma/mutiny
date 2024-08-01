import { z } from "zod";

const usernameRegex = /^[a-z][-a-z0-9_]*$/i;

// Primitives
export const StringId = z.string().describe("String ID");
export const NumberId = z.number().int().positive().describe("Number ID");

// User
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

// Session
export const UsernameOrEmail = z
  .union([Username, EmailAddress])
  .describe("Username or Email Address");
export const SessionId = StringId.length(40).describe("Session ID");

// Profile
export const Name = z.string().min(1).max(64).describe("Name");
export const Birthday = z.coerce
  .date()
  .refine((value) => value < new Date(), {
    message: "Birthday must be in the past",
  })
  .describe("Birthday");
export const Bio = z.string().max(160).describe("Bio");

// Error
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
