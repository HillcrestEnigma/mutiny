import { expect, test, describe, beforeEach } from "bun:test";
import { client, clientSessionSetterSpy } from "../client";
import { UnauthorizedError, ValidationError } from "@repo/error";

describe("User-related methods", () => {
  beforeEach(async () => {
    await client.setSession(null);
    clientSessionSetterSpy.mockClear();
  });

  test("getAuthenticatedUser after createUser", async () => {
    await client.createUser({
      username: "test_user_1",
      email: "test_user_1@example.com",
      password: "password",
    });

    expect(clientSessionSetterSpy).toHaveBeenCalledTimes(1);
    expect(client.sessionToken).not.toBeNull();

    const user = await client.getAuthenticatedUser();

    expect(user.username).toBe("test_user_1");
  });

  test("getAuthenticatedUser when not authenticated", async () => {
    expect(async () => {
      await client.getAuthenticatedUser();
    }).toThrow(UnauthorizedError);
  });

  test("createUser with invalid credentials", async () => {
    expect(async () => {
      await client.createUser({
        username: "test_user_2@",
        email: "test_user_2@example.com",
        password: "password",
      });
    }).toThrow(ValidationError);
  });
});
