import { Client, type ClientOptions as MutinyClientOptions } from "./client";
import "./query/user";
import "./query/session";

const defaultBaseURL = "http://localhost:5000";

export type MutinyClient = Client;

export function MutinyClient(
  baseURL = defaultBaseURL,
  options?: MutinyClientOptions,
) {
  return new Client(baseURL, options);
}

export { type MutinyClientOptions };
export * from "./errors";
