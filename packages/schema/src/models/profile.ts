import { z } from "zod";
import { Bio, Date, Name, NumberId, StringId } from "../fields";

export const Profile = z.object({
  id: NumberId.optional(),
  userId: StringId.optional(),
  name: Name,
  birthday: Date,
  bio: Bio,
});
export type Profile = z.infer<typeof Profile>;
