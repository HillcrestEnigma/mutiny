import { beforeEach, describe, expect, test, inject } from "vitest";
import {
  AuthenticatedSessionResponse,
  SessionResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from "@repo/schema";
import { app } from "../build";

const scenario = inject("scenario");

describe("Authentication", async () => {
  test("Logged in user can see their session details", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/session",
      headers: {
        Authorization: `Bearer ${scenario.users[0].sessions[0].id}`,
      },
    });

    expect(response.statusCode).toBe(200);

    const result = AuthenticatedSessionResponse.parse(response.json());

    expect(result.session.id).toHaveLength(40);
  });

  test("Anonymous users can't see their session details with invalid session id", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/session",
      headers: {
        Authorization: "Bearer invalid",
      },
    });

    expect(response.statusCode).toBe(401);

    const result = UnauthorizedErrorResponse.parse(response.json());

    expect(result.error).toBe("unauthorized");
  });

  test("Anonymous users can't see their session details with no Authentication header", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/session",
    });

    expect(response.statusCode).toBe(401);

    const result = UnauthorizedErrorResponse.parse(response.json());

    expect(result.error).toBe("unauthorized");
  });
});

describe("Sign In", async () => {
  test("Sign in a user with username", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/session",
      payload: {
        usernameOrEmail: scenario.users[0].username,
        password: scenario.users[0].password,
      },
    });

    expect(response.statusCode).toBe(201);
  });

  test("Sign in a user with email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/session",
      payload: {
        usernameOrEmail: scenario.users[0].emails[0].address,
        password: scenario.users[0].password,
      },
    });

    expect(response.statusCode).toBe(201);
  });

  test("Sign in a user with email with different casing", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/session",
      payload: {
        usernameOrEmail: scenario.users[0].emails[0].address.toUpperCase(),
        password: scenario.users[0].password,
      },
    });

    expect(response.statusCode).toBe(201);
  });

  test("Reject sign in with wrong username/email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/session",
      payload: {
        usernameOrEmail: "testuser_wrongusername",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(401);

    const result = UnauthorizedErrorResponse.parse(response.json());

    expect(result.error).toBe("unauthorized");
  });

  test("Reject sign in with wrong password", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/session",
      payload: {
        usernameOrEmail: "testuser",
        password: "password_wrongpassword",
      },
    });

    expect(response.statusCode).toBe(401);

    const result = UnauthorizedErrorResponse.parse(response.json());

    expect(result.error).toBe("unauthorized");
  });
});

describe("Sign Out", async () => {
  let sessionId: string;

  beforeEach(async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/session",
      payload: {
        usernameOrEmail: scenario.users[0].username,
        password: scenario.users[0].password,
      },
    });

    const result = SessionResponse.parse(response.json());

    sessionId = result.sessionId;
  });

  test("Sign out a user", async () => {
    let response = await app.inject({
      method: "DELETE",
      url: "/api/session",
      payload: {
        sessionId,
      },
    });

    expect(response.statusCode).toBe(200);

    response = await app.inject({
      method: "GET",
      url: "/api/session",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    });

    expect(response.statusCode).toBe(401);

    const result = UnauthorizedErrorResponse.parse(response.json());

    expect(result.error).toBe("unauthorized");
  });

  test("Reject sign out with invalid payload", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: "/api/session",
      payload: {
        sessionId: 1,
      },
    });

    expect(response.statusCode).toBe(422);

    const result = ValidationErrorResponse.parse(response.json());

    expect(result.error).toBe("validation");
    expect(result.field).toBe("sessionId");
  });
});
