import { GenericResponse } from "./generic";
import { z } from "zod";

export const APIInfoResponse = GenericResponse.extend({
  version: z.string(),
}).describe("API Information Response");
export type APIInfoResponse = z.infer<typeof APIInfoResponse>;
