import { z } from "zod";
import { Bio, Birthday, Name, NumberId, StringId } from "../fields";

export const Profile = z.object({
  id: NumberId.optional(),
  userId: StringId.optional(),
  name: Name,
  birthday: Birthday,
  bio: Bio,
});
export type Profile = z.infer<typeof Profile>;
