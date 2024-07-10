import { Type, type Static } from "@fastify/type-provider-typebox";
import { GenericResponse } from "./response";
import { ErrorResponse, ValidationErrorResponse } from "./error";

const EmailAddress = Type.String({
  format: "email",
});

export const Email = Type.Object({
  address: EmailAddress,
  verified: Type.Boolean(),
  primary: Type.Boolean(),
});
export type Email = Static<typeof Email>;

const Username = Type.String({
  format: "username",
  minLength: 3,
  maxLength: 32,
});

export const User = Type.Object({
  username: Username,
  emails: Type.Array(Email),
});
export type User = Static<typeof User>;

export const Session = Type.Object({
  id: Type.String(),
  expiresAt: Type.Date(),
  fresh: Type.Boolean(),
  userId: Type.String(),
});
export type Session = Static<typeof Session>;

export const AuthSuccessResponse = Type.Intersect([
  GenericResponse,
  Type.Object({
    sessionId: Type.Optional(Type.String()),
    user: Type.Optional(User),
  }),
]);
export type AuthSuccessResponse = Static<typeof AuthSuccessResponse>;

export const AuthErrorResponse = Type.Union([
  ValidationErrorResponse,
  ErrorResponse,
]);
export type AuthErrorResponse = Static<typeof AuthErrorResponse>;

const Password = Type.String({
  minLength: 8,
  maxLength: 128,
});

export const SignUpPayload = Type.Object({
  username: Username,
  email: EmailAddress,
  password: Password,
});
export type SignUpPayload = Static<typeof SignUpPayload>;

export const SignInPayload = Type.Object({
  usernameOrEmail: Type.String(),
  password: Password,
});
export type SignInPayload = Static<typeof SignInPayload>;

export const SignOutPayload = Type.Object({
  sessionId: Type.String(),
});
export type SignOutPayload = Static<typeof SignOutPayload>;
