import { z } from "zod";

export const GenericResponse = z.object({
  message: z.string(),
});
export type GenericResponse = z.infer<typeof GenericResponse>;
