import { beforeEach, beforeAll, describe, expect, test } from "vitest";
import { SessionResponse, ValidationErrorResponse } from "@repo/schema";
import { app } from "../setup";

describe("Sign In", async () => {
  beforeAll(async () => {
    await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "testuser",
        email: "testuser@example.com",
        password: "password",
      },
    });
  });

  test("Sign in a user with username", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/session",
      payload: {
        usernameOrEmail: "testuser",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(201);

    const result = response.json() as SessionResponse;

    expect(result.sessionId).toHaveLength(40);
  });

  test("Sign in a user with email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/session",
      payload: {
        usernameOrEmail: "testuser@example.com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(201);

    const result = response.json() as SessionResponse;

    expect(result.sessionId).toHaveLength(40);
  });

  test("Sign in a user with email with different casing", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/session",
      payload: {
        usernameOrEmail: "tesTuSer@exAmple.Com",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(201);

    const result = response.json() as SessionResponse;

    expect(result.sessionId).toHaveLength(40);
  });

  test("Reject sign in with wrong username/email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/session",
      payload: {
        usernameOrEmail: "testuser_wrongusername",
        password: "password",
      },
    });

    expect(response.statusCode).toBe(401);

    const result = response.json() as ValidationErrorResponse;

    expect(result.error).toBe("forbidden");
  });

  test("Reject sign in with wrong password", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/session",
      payload: {
        usernameOrEmail: "testuser",
        password: "password_wrongpassword",
      },
    });

    expect(response.statusCode).toBe(401);

    const result = response.json() as ValidationErrorResponse;

    expect(result.error).toBe("forbidden");
  });
});

describe("Sign Out", async () => {
  let sessionId: string;

  beforeAll(async () => {
    await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "testuser_signout",
        email: "testuser_signout@example.com",
        password: "password",
      },
    });
  });

  beforeEach(async () => {
    const response = await app.inject({
      method: "POST",
      url: "/session",
      payload: {
        usernameOrEmail: "testuser_signout@example.com",
        password: "password",
      },
    });

    const result = response.json() as SessionResponse;

    sessionId = result.sessionId;
  });

  test("Sign out a user", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: "/session",
      payload: {
        sessionId,
      },
    });

    expect(response.statusCode).toBe(200);
  });

  test("Reject sign out with invalid payload", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: "/session",
      payload: {
        sessionId: 1,
      },
    });

    expect(response.statusCode).toBe(400);

    const result = response.json() as ValidationErrorResponse;

    expect(result.error).toBe("validation");
    expect(result.field).toBe("sessionId");
  });
});
