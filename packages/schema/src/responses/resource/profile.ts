import { GenericResponse } from "../meta/generic";
import { z } from "zod";
import { ProfilePayload } from "../../payloads/profile";

export const AuthenticatedProfileResponse = GenericResponse.extend({
  profile: ProfilePayload,
}).describe("Authenticated Profile Response");
export type AuthenticatedProfileResponse = z.infer<
  typeof AuthenticatedProfileResponse
>;
