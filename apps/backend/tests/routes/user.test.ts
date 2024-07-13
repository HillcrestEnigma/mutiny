import { describe, expect, test, inject } from "vitest";
import {
  SessionResponse,
  AuthenticatedUserResponse,
  ErrorResponse,
  ValidationErrorResponse,
  ConflictErrorResponse,
} from "@repo/schema";
import { app } from "../build";

const scenario = inject("scenario");

describe("Authentication", async () => {
  test("Logged in user can see their user details", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/user",
      headers: {
        Authorization: `Bearer ${scenario.users[0].sessions[0].id}`,
      },
    });

    expect(response.statusCode).toBe(200);

    const result = response.json() as AuthenticatedUserResponse;

    expect(result.user.username).toBe(scenario.users[0].username);
    expect(result.user).not.toHaveProperty("passwordHash");
    expect(result.user.emails).toHaveLength(1);
    expect(result.user.emails[0].address).toBe(
      scenario.users[0].emails[0].address,
    );
    expect(result.user.emails[0].primary).toBe(true);
  });

  test("Anonymous users can't see their user details with invalid session id", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/user",
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
      url: "/api/user",
    });

    expect(response.statusCode).toBe(401);

    const result = response.json() as ErrorResponse;

    expect(result.error).toBe("unauthorized");
  });
});

describe("Sign Up", async () => {
  test("Signup a new user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/user",
      payload: {
        username: "testuser",
        email: "testuser@example.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(201);

    const result = response.json() as SessionResponse;

    expect(result.sessionId).toHaveLength(40);
  });

  test("Reject signup with bad username", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/user",
      payload: {
        username: "_Testuser@#^$%&^$",
        email: "anemail@website.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(422);

    const result = response.json() as ValidationErrorResponse;

    expect(result.error).toBe("validation");
    expect(result.field).toBe("username");
  });

  test("Reject signup with bad email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/user",
      payload: {
        username: "goodusername",
        email: "notanemail",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(422);

    const result = response.json() as ValidationErrorResponse;

    expect(result.error).toBe("validation");
    expect(result.field).toBe("email");
  });

  test("Reject signup with bad password", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/user",
      payload: {
        username: "goodusername",
        email: "goodemail@goodwebsite.ext",
        password: "short",
      },
    });

    expect(response.statusCode).toBe(422);

    const result = response.json() as ValidationErrorResponse;

    expect(result.error).toBe("validation");
    expect(result.field).toBe("password");
  });

  test("Reject signup with existing username and email", async () => {
    let response = await app.inject({
      method: "POST",
      url: "/api/user",
      payload: {
        username: "sameusername",
        email: "sameemail@example.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(201);

    response = await app.inject({
      method: "POST",
      url: "/api/user",
      payload: {
        username: "sameusername",
        email: "anotheremail@example.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(409);

    let result = response.json() as ConflictErrorResponse;

    expect(result.resource).toBe("username");

    response = await app.inject({
      method: "POST",
      url: "/api/user",
      payload: {
        username: "anotherusername",
        email: "sameemail@example.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(409);

    result = response.json() as ConflictErrorResponse;

    expect(result.resource).toBe("email");
  });
});
