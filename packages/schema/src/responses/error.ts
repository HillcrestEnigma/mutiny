import { z } from "zod";
import { GenericResponse } from "./generic";

export const ErrorType = z.enum([
  "unauthorized", // 401
  "forbidden", // 403
  "notfound", // 404
  "conflict", // 409
  "validation", // 422
  "internal", // 500
]);
export type ErrorType = z.infer<typeof ErrorType>;

export const GenericErrorResponse = GenericResponse.extend({
  message: z.string(),
  error: ErrorType,
}).describe("Generic Error Response");
export type GenericErrorResponse = z.infer<typeof GenericErrorResponse>;

export const UnauthorizedErrorResponse = GenericErrorResponse.extend({
  error: z.literal("unauthorized"),
}).describe("Unauthorized Error Response");
export type UnauthorizedErrorResponse = z.infer<
  typeof UnauthorizedErrorResponse
>;

export const ConflictErrorResponse = GenericErrorResponse.extend({
  error: z.literal("conflict"),
  resource: z.string(),
}).describe("Conflict Error Response");
export type ConflictErrorResponse = z.infer<typeof ConflictErrorResponse>;

export const ValidationErrorResponse = GenericErrorResponse.extend({
  error: z.literal("validation"),
  field: z.string(),
}).describe("Validation Error Response");
export type ValidationErrorResponse = z.infer<typeof ValidationErrorResponse>;

export const ErrorResponse = z.union([
  ValidationErrorResponse,
  GenericErrorResponse,
]);
export type ErrorResponse = z.infer<typeof ErrorResponse>;
