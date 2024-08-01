import {
  SessionCreateResponse,
  UserCreateResponse,
  type ErrorType,
  type ProfileUpsertPayload,
  type SessionCreatePayload,
  type UserCreatePayload,
} from "@repo/schema";
import { build } from "../../src/app";
import { expect } from "vitest";
import type { Response } from "light-my-request";
import { MutinyServerError } from "@repo/error";

declare module "fastify" {
  interface FastifyInstance {
    injectMethod: InjectGeneralMethod;
    injectGet: InjectSafeMethod;
    injectPost: InjectUnsafeMethod;
    injectPut: InjectUnsafeMethod;
    injectDelete: InjectUnsafeMethod;
    createUser: CreateUserMethod;
    createSession: CreateSessionMethod;
    upsertProfile: UpsertProfileMethod;
  }
}

export const app = await build({
  logger: {
    level: "error",
    transport: {
      target: "pino-pretty",
    },
  },
});

interface ExpectOptions {
  statusCode?: number;
  errorType?: ErrorType;
}

interface InjectOptions {
  session?: string;
  headers?: Record<string, string>;
  payload?: object;
  expect?: ExpectOptions;
  // parse?: ZodObject<ZodRawShape>;
}

interface InjectResult {
  response: Response;
  json: object;
}

type InjectMethod<Options> = (
  url: string,
  options?: Options,
) => Promise<InjectResult>;

type InjectGeneralMethod = InjectMethod<
  InjectOptions & { method: "GET" | "POST" | "PUT" | "DELETE" }
>;
type InjectSafeMethod = InjectMethod<Omit<InjectOptions, "payload">>;
type InjectUnsafeMethod = InjectMethod<InjectOptions>;

app.decorate<InjectGeneralMethod>("injectMethod", async (url, options) => {
  const response = await app.inject({
    method: options?.method,
    url,
    headers: {
      ...(options?.session
        ? {
            Authorization: `Bearer ${options.session}`,
          }
        : {}),
      ...options?.headers,
    },
    payload: options?.payload,
  });

  let json = {};
  if (response.statusCode != 204) {
    json = await response.json();
  }

  if (options?.expect) {
    if (options.expect.statusCode) {
      expect(response.statusCode).toBe(options.expect.statusCode);
    }

    if (options.expect.errorType) {
      const error = MutinyServerError.fromResponse(json);

      expect(error.errorType).toBe(options.expect.errorType);
    }
  }

  return { response, json };
});

app.decorate<InjectSafeMethod>("injectGet", async (url, options) => {
  return app.injectMethod(url, {
    method: "GET",
    ...options,
  });
});

app.decorate<InjectUnsafeMethod>("injectPost", async (url, options) => {
  return app.injectMethod(url, {
    method: "POST",
    ...options,
  });
});

app.decorate<InjectUnsafeMethod>("injectPut", async (url, options) => {
  return app.injectMethod(url, {
    method: "PUT",
    ...options,
  });
});

app.decorate<InjectUnsafeMethod>("injectDelete", async (url, options) => {
  return app.injectMethod(url, {
    method: "DELETE",
    ...options,
  });
});

type CreateUserMethod = (
  payload: UserCreatePayload,
) => Promise<UserCreateResponse>;

app.decorate<CreateUserMethod>("createUser", async (payload) => {
  const { json } = await app.injectPut("/api/user", {
    payload,
    expect: {
      statusCode: 201,
    },
  });

  return UserCreateResponse.parse(json);
});

type CreateSessionMethod = (
  payload: SessionCreatePayload,
) => Promise<SessionCreateResponse>;

app.decorate<CreateSessionMethod>("createSession", async (payload) => {
  const { json } = await app.injectPost("/api/session", {
    payload,
    expect: {
      statusCode: 201,
    },
  });

  return SessionCreateResponse.parse(json);
});

type UpsertProfileMethod = (options: {
  profile: ProfileUpsertPayload;
  session: string;
  statusCode?: number;
}) => Promise<void>;

app.decorate<UpsertProfileMethod>(
  "upsertProfile",
  async ({ session, profile, statusCode }) => {
    const { response } = await app.injectPut("/api/profile", {
      session,
      payload: profile,
    });

    if (statusCode) {
      expect(response.statusCode).toBe(statusCode);
    }
  },
);
