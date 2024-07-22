import { MutinyClient } from "@repo/client";
import { type Context as ReactContext, createContext, useContext } from "react";

export type OptionalMutinyClient = MutinyClient | null;

export const MutinyClientContext: ReactContext<OptionalMutinyClient> =
  createContext<OptionalMutinyClient>(null);

export function useMutinyClient(): MutinyClient {
  const client = useContext(MutinyClientContext);

  if (client === null) {
    throw new Error("MutinyProvider not found in the component tree");
  }

  return client;
}
