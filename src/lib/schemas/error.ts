import { Type, type Static } from "@fastify/type-provider-typebox";
import { GenericResponseBody, Response } from "./response";

const ErrorType = Type.Union([
  Type.Literal("validation"),
  Type.Literal("notfound"),
  Type.Literal("forbidden"),
  Type.Literal("unauthorized"),
  Type.Literal("internal"),
]);

export const ErrorResponseBody = Type.Intersect([
  GenericResponseBody,
  Type.Object({
    error: ErrorType,
  }),
]);
export type ErrorResponseBody = Static<typeof ErrorResponseBody>;

export const ErrorResponse = Response(ErrorResponseBody);
export type ErrorResponse = Static<typeof ErrorResponse>;

export const ValidationErrorResponseBody = Type.Intersect([
  ErrorResponseBody,
  Type.Object({
    field: Type.String(),
  }),
]);
export type ValidationErrorResponseBody = Static<
  typeof ValidationErrorResponseBody
>;

export const ValidationErrorResponse = Response(ValidationErrorResponseBody);
export type ValidationErrorResponse = Static<typeof ValidationErrorResponse>;
