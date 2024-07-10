import { describe, expect, test } from "vitest";
import { AuthSuccessResponse } from "../src/lib/schemas/auth.ts";
import { app } from "./setup.ts";
import { ValidationErrorResponse } from "../src/lib/schemas/error.ts";
import { beforeEach } from "vitest";

describe("Sign In", async () => {
  beforeEach(async () => {
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

    const result = response.json() as AuthSuccessResponse;

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

    const result = response.json() as AuthSuccessResponse;

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

    const result = response.json() as AuthSuccessResponse;

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
