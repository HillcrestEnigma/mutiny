import {
  Type,
  type Static,
  type TSchema,
} from "@fastify/type-provider-typebox";

export const Response = <ResponseSchemaType extends TSchema>(
  ResponseSchema: ResponseSchemaType,
) => {
  return Type.Tuple([Type.Integer(), ResponseSchema]);
};

export const GenericResponseBody = Type.Object({
  message: Type.String(),
});
export type GenericResponseBody = Static<typeof GenericResponseBody>;

export const GenericResponse = Response(GenericResponseBody);
export type GenericResponse = Static<typeof GenericResponse>;
