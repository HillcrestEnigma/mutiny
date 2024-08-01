import { beforeEach, describe, expect, test, inject } from "vitest";
import {
  AuthenticatedSessionResponse,
  SessionCreateResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from "@repo/schema";
import { app } from "../utils/build";

const scenario = inject("scenario");

describe("Authentication", async () => {
  test("Logged in user can see their session details", async () => {
    const { json } = await app.injectGet("/api/session", {
      session: scenario.users[0].sessions[0].id,
      expect: {
        statusCode: 200,
      },
    });

    const result = AuthenticatedSessionResponse.parse(json);

    expect(result.session.id).toHaveLength(40);
  });

  test("Anonymous users can't see their session details with invalid session id", async () => {
    const { json } = await app.injectGet("/api/session", {
      session: "invalid",
      expect: {
        statusCode: 401,
      },
    });

    const result = UnauthorizedErrorResponse.parse(json);

    expect(result.error).toBe("unauthorized");
  });

  test("Anonymous users can't see their session details with no Authentication header", async () => {
    const { json } = await app.injectGet("/api/session", {
      expect: {
        statusCode: 401,
      },
    });

    const result = UnauthorizedErrorResponse.parse(json);

    expect(result.error).toBe("unauthorized");
  });
});

describe("Sign In", async () => {
  test("Sign in a user with username", async () => {
    await app.createSession({
      usernameOrEmail: scenario.users[0].username,
      password: scenario.users[0].password,
    });
  });

  test("Sign in a user with email", async () => {
    await app.createSession({
      usernameOrEmail: scenario.users[0].emails[0].address,
      password: scenario.users[0].password,
    });
  });

  test("Sign in a user with email with different casing", async () => {
    await app.createSession({
      usernameOrEmail: scenario.users[0].emails[0].address.toUpperCase(),
      password: scenario.users[0].password,
    });
  });

  test("Reject sign in with wrong username/email", async () => {
    const { json } = await app.injectPost("/api/session", {
      payload: {
        usernameOrEmail: "testuser_wrongusername",
        password: "password",
      },
      expect: {
        statusCode: 401,
      },
    });

    const result = UnauthorizedErrorResponse.parse(json);

    expect(result.error).toBe("unauthorized");
  });

  test("Reject sign in with wrong password", async () => {
    const { json } = await app.injectPost("/api/session", {
      payload: {
        usernameOrEmail: "testuser",
        password: "password_wrongpassword",
      },
      expect: {
        statusCode: 401,
      },
    });

    const result = UnauthorizedErrorResponse.parse(json);

    expect(result.error).toBe("unauthorized");
  });
});

describe("Sign Out", async () => {
  let sessionId: string;

  beforeEach(async () => {
    const { json } = await app.injectPost("/api/session", {
      payload: {
        usernameOrEmail: scenario.users[0].username,
        password: scenario.users[0].password,
      },
      expect: {
        statusCode: 201,
      },
    });

    const result = SessionCreateResponse.parse(json);

    sessionId = result.sessionId;
  });

  test("Sign out a user", async () => {
    await app.injectDelete("/api/session", {
      payload: {
        sessionId,
      },
      expect: {
        statusCode: 204,
      },
    });

    const { json } = await app.injectGet("/api/session", {
      session: sessionId,
      expect: {
        statusCode: 401,
      },
    });

    const result = UnauthorizedErrorResponse.parse(json);

    expect(result.error).toBe("unauthorized");
  });

  test("Reject sign out with invalid payload", async () => {
    const { json } = await app.injectDelete("/api/session", {
      payload: {
        sessionId: 1,
      },
      expect: {
        statusCode: 422,
        errorType: "validation",
      },
    });

    const result = ValidationErrorResponse.parse(json);

    expect(result.field).toBe("sessionId");
  });
});
