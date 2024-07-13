import { z } from "zod";

export const GenericResponse = z.object({}).describe("Generic Response");
export type GenericResponse = z.infer<typeof GenericResponse>;
