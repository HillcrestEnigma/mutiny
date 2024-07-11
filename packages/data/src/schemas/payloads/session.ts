import { z } from "zod";
import { UsernameOrEmail, Password, SessionId } from "../fields";

export const SessionCreatePayload = z.object({
  usernameOrEmail: UsernameOrEmail,
  password: Password,
});
export type SessionCreatePayload = z.infer<typeof SessionCreatePayload>;

export const SessionDeletePayload = z.object({
  sessionId: SessionId,
});
export type SessionDeletePayload = z.infer<typeof SessionDeletePayload>;
