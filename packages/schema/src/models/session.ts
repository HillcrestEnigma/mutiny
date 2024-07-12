import { z } from "zod";
import { SessionId } from "../fields";

export const Session = z.object({
  id: SessionId,
  expiresAt: z.date().optional(),
  fresh: z.boolean().optional(),
  userId: z.string().optional(),
});
export type Session = z.infer<typeof Session>;
