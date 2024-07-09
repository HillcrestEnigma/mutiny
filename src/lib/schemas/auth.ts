import { Type, type Static } from "@fastify/type-provider-typebox";
import { GenericResponseBody, Response } from "./response";

export const Email = Type.Object({
  address: Type.Lowercase(
    Type.String({
      format: "email",
    }),
  ),
  verified: Type.Boolean(),
  primary: Type.Boolean(),
});
export type Email = Static<typeof Email>;

export const User = Type.Object({
  username: Type.String(),
  email: Type.Array(Email),
});
export type User = Static<typeof User>;

export const Session = Type.Object({
  id: Type.String(),
  expiresAt: Type.Date(),
  fresh: Type.Boolean(),
  userId: Type.String(),
});
export type Session = Static<typeof Session>;

export const AuthResponseBody = Type.Intersect([
  GenericResponseBody,
  Type.Object({
    session: Type.Optional(Type.String()),
    user: Type.Optional(User),
  }),
]);
export type AuthResponseBody = Static<typeof AuthResponseBody>;

export const AuthResponse = Response(AuthResponseBody);
export type AuthResponse = Static<typeof AuthResponse>;

export const SignUpPayload = Type.Object({
  username: Type.String({
    format: "username",
    minLength: 3,
    maxLength: 32,
  }),
  email: Type.Lowercase(
    Type.String({
      format: "email",
    }),
  ),
  password: Type.String({
    minLength: 8,
    maxLength: 128,
  }),
});
export type SignUpPayload = Static<typeof SignUpPayload>;
