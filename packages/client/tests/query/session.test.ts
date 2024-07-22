import { expect, test, describe, beforeAll, beforeEach } from "bun:test";
import { client, clientSessionSetterSpy, session } from "../client";
import { UnauthorizedError } from "@repo/error";

describe("Session-related methods", () => {
  let userId: string;

  beforeAll(async () => {
    await client.createUser({
      username: "test_session_1",
      email: "test_session_1@example.com",
      password: "password",
    });

    const user = await client.getAuthenticatedUser();

    userId = user.id;

    await client.setSession(null);
  });

  beforeEach(async () => {
    await client.setSession(null);
    clientSessionSetterSpy.mockClear();
  });

  test("getAuthenticatedSession after createSession with username", async () => {
    await client.createSession({
      usernameOrEmail: "test_session_1",
      password: "password",
    });

    expect(await client.session()).not.toBeNull();
    expect(await client.session()).toEqual(session);

    const result = await client.getAuthenticatedSession();

    expect(result.userId).toBe(userId);
  });

  test("getAuthenticatedSession after createSession with email", async () => {
    await client.createSession({
      usernameOrEmail: "test_session_1@example.com",
      password: "password",
    });

    expect(await client.session()).not.toBeNull();
    expect(await client.session()).toEqual(session);

    const result = await client.getAuthenticatedSession();

    expect(result.userId).toBe(userId);
  });

  test("getAuthenticatedSession after deleteSession", async () => {
    await client.createSession({
      usernameOrEmail: "test_session_1",
      password: "password",
    });

    expect(client.session).not.toBeNull();

    await client.deleteAuthenticatedSession();

    expect(await client.session()).toBeNull();

    expect(async () => {
      await client.getAuthenticatedSession();
    }).toThrow(UnauthorizedError);
  });

  test("deleteSession when not authenticated", async () => {
    await client.deleteAuthenticatedSession();

    expect(await client.session()).toBeNull();
  });

  test("createSession with invalid credentials", async () => {
    expect(async () => {
      await client.createSession({
        usernameOrEmail: "test_session_nonexist",
        password: "password",
      });
    }).toThrow(UnauthorizedError);
  });
});
