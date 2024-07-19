import { Client, type ClientQueryMethod } from "@/client";
import {
  AuthenticatedUserResponse,
  SessionResponse,
  UserCreatePayload,
} from "@repo/schema";

declare module "@/client" {
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
  const result = SessionResponse.parse(await this.post("/user", body));

  this.session = result.sessionId;
};
