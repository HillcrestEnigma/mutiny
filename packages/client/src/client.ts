import { MutinyServerError } from "@repo/error";
import semver from "semver";
import type { Jsonifiable } from "type-fest";
import { ResponseParseError, VersionMismatchError } from "./errors";
import { APIInfoResponse } from "@repo/schema";

enum HTTPRequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type Session = string | null;
export type SessionGetter = () => Promise<Session>;
export type SessionSetter = (sessionToken: Session) => Promise<void>;

export interface ClientOptions {
  baseURL: string;
  stateless?: boolean;
  sessionGetter?: SessionGetter;
  sessionSetter?: SessionSetter;
}

export type ClientQueryMethod<R, A extends Array<unknown> = []> = (
  ...args: A
) => Promise<R>;

export class Client {
  baseURL: string;
  compatibleServerVersion = "0.1.0";
  stateless: boolean = false;
  sessionGetter: SessionGetter = async () => null;
  sessionSetter: SessionSetter = async () => undefined;
  sessionToken: Session = null;

  constructor(options: ClientOptions) {
    this.baseURL = options.baseURL;

    if (options?.stateless) {
      this.stateless = options.stateless;
    }

    if (options?.sessionGetter) {
      this.sessionGetter = options.sessionGetter;
    }

    if (options?.sessionSetter) {
      this.sessionSetter = options.sessionSetter;
    }

    if (!this.stateless) {
      this.sessionGetter().then((sessionToken) => {
        this.sessionToken = sessionToken;
      });
    }

    this.checkServer();
  }

  async setSession(token: Session) {
    if (!this.stateless) {
      this.sessionToken = token;
    }

    await this.sessionSetter(token);
  }

  async session() {
    let sessionToken = this.sessionToken;

    if (this.stateless || !sessionToken) {
      sessionToken = await this.sessionGetter();

      if (!this.stateless) {
        this.sessionToken = sessionToken;
      }
    }

    return sessionToken;
  }

  url(path: string) {
    return new URL(this.baseURL + path);
  }

  async headers(json: boolean) {
    const session = await this.session();

    const headers: Record<string, string> = {
      Authorization: session ? `Bearer ${session}` : "",
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
    body?: Jsonifiable,
  ): Promise<Jsonifiable> {
    const headers = await this.headers(body !== undefined);

    const response = await fetch(this.url(path), {
      method,
      headers,
      body: JSON.stringify(body),
    });

    if (response.status === 204) {
      return {};
    }

    const result = await response.json();

    if (!response.ok) {
      throw MutinyServerError.fromResponse(result);
    }

    return result;
  }

  async get(path = "") {
    return await this.fetch(path, HTTPRequestMethod.GET);
  }

  async post(path = "", object?: Jsonifiable) {
    return await this.fetch(path, HTTPRequestMethod.POST, object);
  }

  async put(path = "", object?: Jsonifiable) {
    return await this.fetch(path, HTTPRequestMethod.PUT, object);
  }

  async delete(path = "", object?: Jsonifiable) {
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
