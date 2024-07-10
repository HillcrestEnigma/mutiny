import { Type, type Static } from "@fastify/type-provider-typebox";

export const GenericResponse = Type.Object({
  message: Type.String(),
});
export type GenericResponse = Static<typeof GenericResponse>;
