import { expect, test, describe } from "bun:test";
import { client, clientSessionSetterSpy } from "../client";

describe("User-related methods", () => {
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
});
