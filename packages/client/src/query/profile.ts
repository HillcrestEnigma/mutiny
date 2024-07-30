import { Client, type ClientQueryMethod } from "../client";
import {
  AuthenticatedProfileResponse,
  type ProfileUpsertPayload,
} from "@repo/schema";

declare module "../client" {
  interface Client {
    getAuthenticatedProfile: ClientQueryMethod<
      AuthenticatedProfileResponse["profile"]
    >;
    upsertProfile: ClientQueryMethod<void, [ProfileUpsertPayload]>;
  }
}

Client.prototype.getAuthenticatedProfile = async function () {
  const result = AuthenticatedProfileResponse.parse(await this.get("/profile"));

  return result.profile;
};

Client.prototype.upsertProfile = async function (body: ProfileUpsertPayload) {
  await this.put("/profile", body);
};
