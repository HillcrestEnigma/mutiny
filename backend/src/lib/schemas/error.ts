import { Type, type Static } from "@fastify/type-provider-typebox";
import { GenericResponse } from "./response";

const ErrorType = Type.Union([
  Type.Literal("validation"),
  Type.Literal("notfound"),
  Type.Literal("forbidden"),
  Type.Literal("unauthorized"),
  Type.Literal("internal"),
]);

export const ErrorResponse = Type.Intersect([
  GenericResponse,
  Type.Object({
    error: ErrorType,
  }),
]);
export type ErrorResponse = Static<typeof ErrorResponse>;

export const ValidationErrorResponse = Type.Intersect([
  ErrorResponse,
  Type.Object({
    field: Type.String(),
  }),
]);
export type ValidationErrorResponse = Static<typeof ValidationErrorResponse>;
