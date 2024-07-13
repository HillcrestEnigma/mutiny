import { SessionId } from "../fields";
import { Session } from "../models/session";
import { GenericResponse } from "./generic";
import { z } from "zod";

export const SessionResponse = GenericResponse.extend({
  sessionId: SessionId,
}).describe("Successful Authentication Response");
export type SessionResponse = z.infer<typeof SessionResponse>;

export const AuthenticatedSessionResponse = GenericResponse.extend({
  session: Session.required(),
}).describe("Authenticated Session Response");
export type AuthenticatedSessionResponse = z.infer<
  typeof AuthenticatedSessionResponse
>;
