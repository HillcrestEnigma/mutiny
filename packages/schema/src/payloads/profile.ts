import { z } from "zod";
import { Profile } from "../models/profile";

export const ProfilePayload = Profile.required().omit({
  id: true,
  userId: true,
});
export type ProfilePayload = z.infer<typeof ProfilePayload>;

export const ProfileUpsertPayload = ProfilePayload;
export type ProfileUpsertPayload = ProfilePayload;
