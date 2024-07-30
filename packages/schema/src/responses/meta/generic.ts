import { z } from "zod";

// Generic Response & 200 OK
export const GenericResponse = z.object({}).describe("Generic Response");
export type GenericResponse = z.infer<typeof GenericResponse>;

// 201 Created
export const CreatedResponse = GenericResponse.describe("Created Response");
export type CreatedResponse = GenericResponse;

// 204 No Content (No Content)
export const NoContentResponse = GenericResponse.describe(
  "No Content Response",
);
export type NoContentResponse = GenericResponse;

// 204 No Content (Updated)
export const UpdatedResponse = GenericResponse.describe("Updated Response");
export type UpdatedResponse = GenericResponse;

// 204 No Content (Deleted)
export const DeletedResponse = GenericResponse.describe("Deleted Response");
export type DeletedResponse = GenericResponse;
