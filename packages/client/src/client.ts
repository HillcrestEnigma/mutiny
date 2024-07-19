import { MutinyServerError } from "@repo/error";
import semver from "semver";
import type { JsonObject } from "type-fest";
import { ResponseParseError, VersionMismatchError } from "./errors";
import { APIInfoResponse } from "@repo/schema";

enum HTTPRequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type Session = string | null;
export type SessionGetter = () => Session;
export type SessionSetter = (sessionToken: Session) => void;

export interface ClientOptions {
  sessionGetter?: SessionGetter;
  sessionSetter?: SessionSetter;
}

export type ClientQueryMethod<R, A extends Array<unknown> = []> = (
  ...args: A
) => Promise<R>;

export class Client {
  baseURL: string;
  sessionToken: Session;
  sessionGetter: SessionGetter = () => null;
  sessionSetter: SessionSetter = () => undefined;
  compatibleServerVersion = "0.1.0";

  constructor(baseURL: string, options?: ClientOptions) {
    this.baseURL = baseURL;

    if (options && options.sessionGetter) {
      this.sessionGetter = options.sessionGetter;
    }

    if (options && options.sessionSetter) {
      this.sessionSetter = options.sessionSetter;
    }

    this.sessionToken = this.sessionGetter();

    this.checkServer();
  }

  set session(token: Session) {
    this.sessionToken = token;

    this.sessionSetter(token);
  }

  get session() {
    if (!this.sessionToken) {
      this.sessionToken = this.sessionGetter();
    }

    return this.sessionToken;
  }

  url(path: string) {
    return new URL(this.baseURL + path);
  }

  headers(json: boolean) {
    const headers: Record<string, string> = {
      Authorization: this.session ? `Bearer ${this.session}` : "",
    };

    if (json) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  couldNotParseResponseAbsolutely(message?: string): never {
    throw new ResponseParseError(message);
  }

  async couldNotParseResponse() {
    this.checkServer();

    this.couldNotParseResponseAbsolutely();
  }

  async fetch(
    path: string,
    method: HTTPRequestMethod,
    body?: JsonObject,
  ): Promise<JsonObject> {
    const response = await fetch(this.url(path), {
      method,
      headers: this.headers(body !== undefined),
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      throw MutinyServerError.fromResponse(result);
    }

    return result;
  }

  async get(path = "") {
    return await this.fetch(path, HTTPRequestMethod.GET);
  }

  async post(path = "", object?: JsonObject) {
    return await this.fetch(path, HTTPRequestMethod.POST, object);
  }

  async put(path = "", object?: JsonObject) {
    return await this.fetch(path, HTTPRequestMethod.PUT, object);
  }

  async delete(path = "", object?: JsonObject) {
    return await this.fetch(path, HTTPRequestMethod.DELETE, object);
  }

  async checkServer() {
    const result = APIInfoResponse.parse(await this.get());

    const serverVersion = result.version;

    if (!semver.satisfies(this.compatibleServerVersion, serverVersion)) {
      throw new VersionMismatchError(
        this.compatibleServerVersion,
        serverVersion,
      );
    }
  }
}
