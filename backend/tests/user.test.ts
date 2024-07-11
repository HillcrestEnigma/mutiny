import { beforeAll, describe, expect, test } from "vitest";
import {
  AuthSuccessResponse,
  UserDetailResponse,
} from "../src/lib/schemas/auth.ts";
import { app } from "./setup.ts";
import {
  ErrorResponse,
  ValidationErrorResponse,
} from "../src/lib/schemas/error.ts";

describe("Sign Up", async () => {
  test("Signup a new user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "testuser",
        email: "testuser@example.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(201);

    const result = response.json() as AuthSuccessResponse;

    expect(result.sessionId).toHaveLength(40);
  });

  test("Reject signup with bad username", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "_Testuser@#^$%&^$",
        email: "anemail@website.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(400);

    const result = response.json() as ValidationErrorResponse;

    expect(result.error).toBe("validation");
    expect(result.field).toBe("username");
  });

  test("Reject signup with bad email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "goodusername",
        email: "notanemail",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(400);

    const result = response.json() as ValidationErrorResponse;

    expect(result.error).toBe("validation");
    expect(result.field).toBe("email");
  });

  test("Reject signup with bad password", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "goodusername",
        email: "goodemail@goodwebsite.ext",
        password: "short",
      },
    });

    expect(response.statusCode).toBe(400);

    const result = response.json() as ValidationErrorResponse;

    expect(result.error).toBe("validation");
    expect(result.field).toBe("password");
  });

  test("Reject signup with existing username and email", async () => {
    let response = await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "sameusername",
        email: "sameemail@example.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(201);

    response = await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "sameusername",
        email: "anotheremail@example.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(401);

    response = await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "anotherusername",
        email: "sameemail@example.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(401);
  });
});

describe("Authentication", async () => {
  let sessionId: string;

  beforeAll(async () => {
    await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "testuser_auth",
        email: "testuser_auth@example.com",
        password: "password",
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/session",
      payload: {
        usernameOrEmail: "testuser_auth@example.com",
        password: "password",
      },
    });

    const result = response.json() as AuthSuccessResponse;

    sessionId = result.sessionId;
  });

  test("Logged in user can see their user details", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/user",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    expect(response.statusCode).toBe(200);

    const result = response.json() as UserDetailResponse;

    expect(result.session.id).toBe(sessionId);
    expect(result.user.username).toBe("testuser_auth");
    expect(result.user.emails).toHaveLength(1);
    expect(result.user.emails[0].address).toBe("testuser_auth@example.com");
    expect(result.user.emails[0].primary).toBe(true);
  });

  test("Anonymous users can't see their user details with invalid session id", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/user",
      headers: {
        Authorization: "Bearer invalid",
      },
    });

    expect(response.statusCode).toBe(401);

    const result = response.json() as ErrorResponse;

    expect(result.error).toBe("unauthorized");
  });

  test("Anonymous users can't see their user details with no Authentication header", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/user",
    });

    expect(response.statusCode).toBe(401);

    const result = response.json() as ErrorResponse;

    expect(result.error).toBe("unauthorized");
  });
});
