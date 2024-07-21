import { MutinyClient } from "@repo/client";
import { createContext, useContext } from "react";

const defaultClient = MutinyClient();

export const MutinyClientContext: React.Context<MutinyClient> =
  createContext(defaultClient);

export function useMutinyClient(): MutinyClient {
  return useContext(MutinyClientContext);
}
