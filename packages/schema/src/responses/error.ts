import { z } from "zod";
import { GenericResponse } from "./generic";
import { ErrorType } from "../fields";

export const GenericErrorResponse = GenericResponse.extend({
  message: z.string(),
  error: ErrorType,
}).describe("Generic Error Response");
export type GenericErrorResponse = z.infer<typeof GenericErrorResponse>;

// Base ErrorResponse types for 404, 409
const ResourceErrorResponse = GenericErrorResponse.extend({
  resource: z.string(),
});

// 401
export const UnauthorizedErrorResponse = GenericErrorResponse.extend({
  error: z.literal("unauthorized"),
}).describe("Unauthorized Error Response");
export type UnauthorizedErrorResponse = z.infer<
  typeof UnauthorizedErrorResponse
>;

// 404
export const NotFoundErrorResponse = ResourceErrorResponse.extend({
  error: z.literal("notfound"),
}).describe("Not Found Error Response");
export type NotFoundErrorResponse = z.infer<typeof NotFoundErrorResponse>;

// 409
export const ConflictErrorResponse = ResourceErrorResponse.extend({
  error: z.literal("conflict"),
}).describe("Conflict Error Response");
export type ConflictErrorResponse = z.infer<typeof ConflictErrorResponse>;

// 422
export const ValidationErrorResponse = GenericErrorResponse.extend({
  error: z.literal("validation"),
  field: z.string(),
}).describe("Validation Error Response");
export type ValidationErrorResponse = z.infer<typeof ValidationErrorResponse>;

// Fastify Error
export const FastifyErrorResponse = GenericErrorResponse.extend({
  error: z.literal("fastify"),
  code: z.string(),
}).describe("Fastify Error Response");
export type FastifyErrorResponse = z.infer<typeof FastifyErrorResponse>;
