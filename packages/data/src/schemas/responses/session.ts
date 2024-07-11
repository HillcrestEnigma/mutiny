import { SessionId } from "../fields";
import { GenericResponse } from "./generic";
import { z } from "zod";

export const SessionResponse = GenericResponse.and(
  z.object({
    sessionId: SessionId,
  }),
);
export type SessionResponse = z.infer<typeof SessionResponse>;
