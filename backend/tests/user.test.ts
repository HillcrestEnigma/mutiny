import { describe, expect, test } from "vitest";
import { AuthSuccessResponse } from "../src/lib/schemas/auth.ts";
import { app } from "./setup.ts";
import { ValidationErrorResponse } from "../src/lib/schemas/error.ts";

describe("Users", async () => {
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
    expect(result.field).toBe("body/username");
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
    expect(result.field).toBe("body/email");
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
    expect(result.field).toBe("body/password");
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
