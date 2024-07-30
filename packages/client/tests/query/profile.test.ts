import { beforeAll, expect, test, describe } from "bun:test";
import { client } from "../client";
import { NotFoundError } from "@repo/error";

describe("Profile-related methods", () => {
  beforeAll(async () => {
    await client.createUser({
      username: "test_profile_1",
      email: "test_profile_1@example.com",
      password: "password",
    });
  });

  test("getAuthenticatedProfile after upsertProfile", async () => {
    let profile = {
      name: "Test Profile 1",
      birthday: new Date(2000, 1, 1),
      bio: "This is a test profile.",
    };

    expect(async () => {
      await client.getAuthenticatedProfile();
    }).toThrow(NotFoundError);

    await client.upsertProfile(profile);

    let result = await client.getAuthenticatedProfile();

    expect(result).toStrictEqual(profile);

    profile = {
      ...profile,
      bio: "This is an updated test profile.",
    };

    await client.upsertProfile(profile);

    result = await client.getAuthenticatedProfile();

    expect(result).toStrictEqual(profile);
  });
});
