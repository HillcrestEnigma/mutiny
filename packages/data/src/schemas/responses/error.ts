import { z } from "zod";
import { GenericResponse } from "./generic";

const ErrorType = z.enum([
  "validation",
  "notfound",
  "forbidden",
  "unauthorized",
  "internal",
]);

export const GenericErrorResponse = GenericResponse.and(
  z.object({
    error: ErrorType,
  }),
);
export type GenericErrorResponse = z.infer<typeof GenericErrorResponse>;

export const ValidationErrorResponse = GenericErrorResponse.and(
  z.object({
    field: z.string(),
  }),
);
export type ValidationErrorResponse = z.infer<typeof ValidationErrorResponse>;

export const ErrorResponse = z.union([
  ValidationErrorResponse,
  GenericErrorResponse,
]);
export type ErrorResponse = z.infer<typeof ErrorResponse>;
