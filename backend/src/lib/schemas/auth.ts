import { GenericResponse } from "./response";
import { ErrorResponse, ValidationErrorResponse } from "./error";
import { z } from "zod";

const EmailAddress = z.string().email().toLowerCase();

export const Email = z.object({
  userId: z.string(),
  address: EmailAddress,
  verified: z.boolean(),
  primary: z.boolean(),
});
export type Email = z.infer<typeof Email>;

const usernameRegex = /^[a-z][-a-z0-9_]*$/i;

const Username = z
  .string()
  .min(3)
  .max(32)
  .refine((value) => usernameRegex.test(value));

export const User = z.object({
  id: z.string(),
  username: Username,
  emails: Email.array(),
});
export type User = z.infer<typeof User>;

export const Session = z.object({
  id: z.string(),
  expiresAt: z.date(),
  fresh: z.boolean(),
  userId: z.string(),
});
export type Session = z.infer<typeof Session>;

export const AuthSuccessResponse = GenericResponse.and(
  z.object({
    sessionId: z.string(),
  }),
);
export type AuthSuccessResponse = z.infer<typeof AuthSuccessResponse>;

export const AuthErrorResponse = z.union([
  ValidationErrorResponse,
  ErrorResponse,
]);
export type AuthErrorResponse = z.infer<typeof AuthErrorResponse>;

const Password = z.string().min(8).max(128);

export const SignUpPayload = z.object({
  username: Username,
  email: EmailAddress,
  password: Password,
});
export type SignUpPayload = z.infer<typeof SignUpPayload>;

export const SignInPayload = z.object({
  usernameOrEmail: z.union([EmailAddress, Username]),
  password: Password,
});
export type SignInPayload = z.infer<typeof SignInPayload>;

export const SignOutPayload = z.object({
  sessionId: z.string(),
});
export type SignOutPayload = z.infer<typeof SignOutPayload>;

export const UserDetailResponse = GenericResponse.and(
  z.object({
    session: Session,
    user: User,
  }),
);
export type UserDetailResponse = z.infer<typeof UserDetailResponse>;
