import { describe, expect, test, inject } from "vitest";
import {
  AuthenticatedProfileResponse,
  Profile,
  UnauthorizedErrorResponse,
  UserCreateResponse,
  ValidationErrorResponse,
} from "@repo/schema";
import { app } from "../utils/build";

const scenario = inject("scenario");

describe("Reading a profile", async () => {
  test("Logged in user can see their profile details", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/profile",
      headers: {
        Authorization: `Bearer ${scenario.users[0].sessions[0].id}`,
      },
    });

    expect(response.statusCode).toBe(200);

    expect(
      AuthenticatedProfileResponse.parse(response.json()).profile,
    ).toStrictEqual(Profile.parse(scenario.users[0].profile));
  });

  test("Anonymous users can't see their profile details", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/profile",
      headers: {
        Authorization: "Bearer invalid",
      },
    });

    expect(response.statusCode).toBe(401);

    expect(UnauthorizedErrorResponse.parse(response.json()).error).toBe(
      "unauthorized",
    );
  });
});

describe("Upserting a profile", async () => {
  test("Upserting a profile for a newly created user", async () => {
    let response = await app.inject({
      method: "PUT",
      url: "/api/user",
      payload: {
        username: "testuser_withoutprofile",
        email: "testuser_withoutprofile@example.com",
        password: "password",
      },
    });

    const userCreateResult = UserCreateResponse.parse(response.json());

    const sessionId = userCreateResult.sessionId;

    response = await app.inject({
      method: "GET",
      url: "/api/profile",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    expect(response.statusCode).toBe(404);

    let profile = {
      name: "testuser withoutprofile",
      birthday: new Date(2010, 1, 1),
      bio: "This is a test user that used to have no profile.",
    };

    response = await app.inject({
      method: "PUT",
      url: "/api/profile",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
      payload: profile,
    });

    expect(response.statusCode).toBe(201);

    response = await app.inject({
      method: "GET",
      url: "/api/profile",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    expect(response.statusCode).toBe(200);

    let profileResult = AuthenticatedProfileResponse.parse(response.json());

    expect(profileResult.profile).toEqual(profile);

    profile = {
      ...profile,
      bio: "This is a test user that now has profile.",
    };

    response = await app.inject({
      method: "PUT",
      url: "/api/profile",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
      payload: profile,
    });

    expect(response.statusCode).toBe(204);

    response = await app.inject({
      method: "GET",
      url: "/api/profile",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    expect(response.statusCode).toBe(200);

    profileResult = AuthenticatedProfileResponse.parse(response.json());

    expect(profileResult.profile).toEqual(profile);
  });

  test("Reject upserting a profile for an anonymous user", async () => {
    const response = await app.inject({
      method: "PUT",
      url: "/api/profile",
      headers: {
        Authorization: `Bearer invalid`,
      },
      payload: {
        name: "testanonuser withoutprofile",
        birthday: new Date(2010, 1, 1),
        bio: "This is a test user that is anonymous.",
      },
    });

    expect(response.statusCode).toBe(401);

    const result = UnauthorizedErrorResponse.parse(response.json());

    expect(result.error).toBe("unauthorized");
  });

  test("Reject upserting a valid profile for a user", async () => {
    let response = await app.inject({
      method: "PUT",
      url: "/api/user",
      payload: {
        username: "testuser_withoutvalidprofile",
        email: "testuser_withoutvalidprofile@example.com",
        password: "password",
      },
    });

    const userCreateResult = UserCreateResponse.parse(response.json());

    const sessionId = userCreateResult.sessionId;

    response = await app.inject({
      method: "PUT",
      url: "/api/profile",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
      payload: {
        name: "invalid profile",
        bio: "This is a profile that is incomplete.",
      },
    });

    expect(response.statusCode).toBe(422);

    const result = ValidationErrorResponse.parse(response.json());

    expect(result.error).toBe("validation");
    expect(result.field).toBe("birthday");
  });
});
