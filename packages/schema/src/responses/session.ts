import { SessionId } from "../fields";
import { Session } from "../models/session";
import { GenericResponse } from "./generic";
import { z } from "zod";

export const SessionResponse = GenericResponse.and(
  z.object({
    sessionId: SessionId,
  }),
);
export type SessionResponse = z.infer<typeof SessionResponse>;

export const AuthenticatedSessionResponse = GenericResponse.and(
  z.object({
    session: Session.required(),
  }),
);
export type AuthenticatedSessionResponse = z.infer<
  typeof AuthenticatedSessionResponse
>;
