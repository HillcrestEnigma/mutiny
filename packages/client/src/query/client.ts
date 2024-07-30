import { Client, type ClientQueryMethod } from "../client";
import {
  AuthenticatedSessionResponse,
  SessionCreatePayload,
  SessionCreateResponse,
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
  const result = SessionCreateResponse.parse(await this.post("/session", body));

  await this.setSession(result.sessionId);
};

Client.prototype.deleteAuthenticatedSession = async function () {
  const session = await this.session();

  if (!session) {
    return;
  }

  const body: SessionDeletePayload = {
    sessionId: session,
  };

  await this.setSession(null);

  await this.delete("/session", body);
};
