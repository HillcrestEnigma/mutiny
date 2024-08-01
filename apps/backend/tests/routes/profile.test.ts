import { describe, expect, test, inject } from "vitest";
import {
  AuthenticatedProfileResponse,
  Profile,
  ValidationErrorResponse,
} from "@repo/schema";
import { app } from "../utils/build";

const scenario = inject("scenario");

describe("Reading a profile", async () => {
  test("Logged in user can see their profile details", async () => {
    const { json } = await app.injectGet("/api/profile", {
      session: scenario.users[0].sessions[0].id,
      expect: {
        statusCode: 200,
      },
    });

    expect(AuthenticatedProfileResponse.parse(json).profile).toStrictEqual(
      Profile.parse(scenario.users[0].profile),
    );
  });

  test("Anonymous users can't see their profile details", async () => {
    await app.injectGet("/api/profile", {
      expect: {
        statusCode: 401,
        errorType: "unauthorized",
      },
    });
  });
});

describe("Upserting a profile", async () => {
  test("Upserting a profile for a newly created user", async () => {
    const userCreateResult = await app.createUser({
      username: "testuser_withoutprofile",
      email: "testuser_withoutprofile@example.com",
      password: "password",
    });

    const sessionId = userCreateResult.sessionId;

    await app.injectGet("/api/profile", {
      session: sessionId,
      expect: {
        statusCode: 404,
      },
    });

    let profile = {
      name: "testuser withoutprofile",
      birthday: new Date(2010, 1, 1),
      bio: "This is a test user that used to have no profile.",
    };

    await app.upsertProfile({
      profile,
      session: sessionId,
      statusCode: 201,
    });

    let { json } = await app.injectGet("/api/profile", {
      session: sessionId,
      expect: {
        statusCode: 200,
      },
    });

    let profileResult = AuthenticatedProfileResponse.parse(json);

    expect(profileResult.profile).toEqual(profile);

    profile = {
      ...profile,
      bio: "This is a test user that now has profile.",
    };

    await app.upsertProfile({
      profile,
      session: sessionId,
      statusCode: 204,
    });

    ({ json } = await app.injectGet("/api/profile", {
      session: sessionId,
      expect: {
        statusCode: 200,
      },
    }));

    profileResult = AuthenticatedProfileResponse.parse(json);

    expect(profileResult.profile).toEqual(profile);
  });

  test("Reject upserting a profile for an anonymous user", async () => {
    await app.injectPut("/api/profile", {
      payload: {
        name: "testanonuser withoutprofile",
        birthday: new Date(2010, 1, 1),
        bio: "This is a test user that is anonymous.",
      },
      expect: {
        statusCode: 401,
        errorType: "unauthorized",
      },
    });
  });

  test("Reject upserting a profile with missing fields for a user", async () => {
    const { json } = await app.injectPut("/api/profile", {
      session: scenario.users[0].sessions[0].id,
      payload: {
        name: "invalid profile",
        bio: "This is a profile that is incomplete.",
      },
      expect: {
        statusCode: 422,
        errorType: "validation",
      },
    });

    const result = ValidationErrorResponse.parse(json);

    expect(result.field).toBe("birthday");
  });

  test("Reject upserting a profile with birthday in the future", async () => {
    const { json } = await app.injectPut("/api/profile", {
      session: scenario.users[0].sessions[0].id,
      payload: {
        name: "invalid profile",
        bio: "This is a profile with a birthday in the future.",
        birthday: new Date(Date.now() + 1000 * 60 * 60),
      },
      expect: {
        statusCode: 422,
        errorType: "validation",
      },
    });

    const result = ValidationErrorResponse.parse(json);

    expect(result.field).toBe("birthday");
  });

  test("Reject upserting a profile with a bio longer than 160 characters", async () => {
    const { json } = await app.injectPut("/api/profile", {
      session: scenario.users[0].sessions[0].id,
      payload: {
        name: "invalid profile to test bio length",
        bio: "A".repeat(161),
        birthday: new Date(2000, 1, 1),
      },
      expect: {
        statusCode: 422,
        errorType: "validation",
      },
    });

    const result = ValidationErrorResponse.parse(json);

    expect(result.field).toBe("bio");
  });
});
