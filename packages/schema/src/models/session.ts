import { z } from "zod";
import { Date, SessionId } from "../fields";

export const Session = z.object({
  id: SessionId,
  expiresAt: Date.optional(),
  fresh: z.boolean().optional(),
  userId: z.string().optional(),
});
export type Session = z.infer<typeof Session>;
