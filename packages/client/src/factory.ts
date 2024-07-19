import { Client, type ClientOptions as MutinyClientOptions } from "./client";
import "./query/user";
import "./query/session";

export type MutinyClient = Client;

export function MutinyClient(baseURL: string, options?: MutinyClientOptions) {
  return new Client(baseURL, options);
}

export { type MutinyClientOptions };
export * from "./errors";
