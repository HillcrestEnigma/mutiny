import { describe, expect, test, inject } from "vitest";
import {
  AuthenticatedUserResponse,
  ValidationErrorResponse,
  ConflictErrorResponse,
  UserCreateResponse,
} from "@repo/schema";
import { app } from "../utils/build";

const scenario = inject("scenario");

describe("Authentication", async () => {
  test("Logged in user can see their user details", async () => {
    const { json } = await app.injectGet("/api/user", {
      session: scenario.users[0].sessions[0].id,
      expect: {
        statusCode: 200,
      },
    });

    const result = AuthenticatedUserResponse.parse(json);

    expect(result.user.username).toBe(scenario.users[0].username);
    expect(result.user).not.toHaveProperty("passwordHash");
    expect(result.user.emails).toHaveLength(1);
    expect(result.user.emails[0].address).toBe(
      scenario.users[0].emails[0].address,
    );
    expect(result.user.emails[0].primary).toBe(true);
  });

  test("Anonymous users can't see their user details with invalid session id", async () => {
    await app.injectGet("/api/user", {
      session: "invalid",
      expect: {
        statusCode: 401,
        errorType: "unauthorized",
      },
    });
  });

  test("Anonymous users can't see their user details with no Authentication header", async () => {
    await app.injectGet("/api/user", {
      expect: {
        statusCode: 401,
        errorType: "unauthorized",
      },
    });
  });
});

describe("Sign Up", async () => {
  test("Signup a new user", async () => {
    const { json } = await app.injectPut("/api/user", {
      payload: {
        username: "testuser",
        email: "testuser@example.com",
        password: "password",
      },
      expect: {
        statusCode: 201,
      },
    });

    const result = UserCreateResponse.parse(json);

    expect(result.sessionId).toHaveLength(40);
  });

  test("Reject signup with bad username", async () => {
    const { json } = await app.injectPut("/api/user", {
      payload: {
        username: "_Testuser@#^$%&^$",
        email: "anemail@website.com",
        password: "password",
      },
      expect: {
        statusCode: 422,
        errorType: "validation",
      },
    });

    const result = ValidationErrorResponse.parse(json);

    expect(result.field).toBe("username");
  });

  test("Reject signup with bad email", async () => {
    const { json } = await app.injectPut("/api/user", {
      payload: {
        username: "goodusername",
        email: "notanemail",
        password: "password",
      },
      expect: {
        statusCode: 422,
      },
    });

    const result = ValidationErrorResponse.parse(json);

    expect(result.field).toBe("email");
  });

  test("Reject signup with bad password", async () => {
    const { json } = await app.injectPut("/api/user", {
      payload: {
        username: "goodusername",
        email: "goodemail@goodwebsite.ext",
        password: "short",
      },
      expect: {
        statusCode: 422,
        errorType: "validation",
      },
    });

    const result = ValidationErrorResponse.parse(json);

    expect(result.field).toBe("password");
  });

  test("Reject signup with existing username and email", async () => {
    await app.createUser({
      username: "sameusername",
      email: "sameemail@example.com",
      password: "password",
    });

    let { json } = await app.injectPut("/api/user", {
      payload: {
        username: "sameusername",
        email: "anotheremail@example.com",
        password: "password",
      },
      expect: {
        statusCode: 409,
        errorType: "conflict",
      },
    });

    let result = ConflictErrorResponse.parse(json);

    expect(result.resource).toBe("username");

    ({ json } = await app.injectPut("/api/user", {
      payload: {
        username: "anotherusername",
        email: "sameemail@example.com",
        password: "password",
      },
      expect: {
        statusCode: 409,
        errorType: "conflict",
      },
    }));

    result = ConflictErrorResponse.parse(json);

    expect(result.resource).toBe("email");
  });
});
