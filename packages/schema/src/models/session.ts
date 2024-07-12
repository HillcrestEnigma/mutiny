import { z } from "zod";
import { SessionId } from "../fields";

export const Session = z.object({
  id: SessionId,
  expiresAt: z.date(),
  fresh: z.boolean(),
  userId: z.string(),
});
export type Session = z.infer<typeof Session>;
