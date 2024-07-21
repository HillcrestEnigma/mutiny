import { Client, type ClientQueryMethod } from "../client";
import {
  AuthenticatedSessionResponse,
  SessionResponse,
  SessionCreatePayload,
  SessionDeletePayload,
} from "@repo/schema";

declare module "../client" {
  interface Client {
    getAuthenticatedSession: ClientQueryMethod<
      AuthenticatedSessionResponse["session"]
    >;
    createSession: ClientQueryMethod<void, [SessionCreatePayload]>;
    deleteAuthenticatedSession: ClientQueryMethod<void>;
  }
}

Client.prototype.getAuthenticatedSession = async function () {
  const result = AuthenticatedSessionResponse.parse(await this.get("/session"));

  return result.session;
};

Client.prototype.createSession = async function (body: SessionCreatePayload) {
  const result = SessionResponse.parse(await this.post("/session", body));

  this.session = result.sessionId;
};

Client.prototype.deleteAuthenticatedSession = async function () {
  if (!this.session) {
    return;
  }

  const body: SessionDeletePayload = {
    sessionId: this.session,
  };

  this.session = null;

  await this.delete("/session", body);
};
