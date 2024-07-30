import { Client, type ClientOptions as MutinyClientOptions } from "./client";
import "./query/user";
import "./query/session";
import "./query/profile";

export type MutinyClient = Client;

export function MutinyClient(options: MutinyClientOptions) {
  return new Client(options);
}

export { type MutinyClientOptions };
export * from "./errors";
