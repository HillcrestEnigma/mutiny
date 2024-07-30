import { Client, type ClientQueryMethod } from "../client";
import {
  AuthenticatedUserResponse,
  UserCreatePayload,
  UserCreateResponse,
} from "@repo/schema";

declare module "../client" {
  interface Client {
    getAuthenticatedUser: ClientQueryMethod<AuthenticatedUserResponse["user"]>;
    createUser: ClientQueryMethod<void, [UserCreatePayload]>;
  }
}

Client.prototype.getAuthenticatedUser = async function () {
  const result = AuthenticatedUserResponse.parse(await this.get("/user"));

  return result.user;
};

Client.prototype.createUser = async function (body: UserCreatePayload) {
  const result = UserCreateResponse.parse(await this.put("/user", body));

  await this.setSession(result.sessionId);
};
