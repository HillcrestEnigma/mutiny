import type { MutinyClient } from "@repo/client";
import {
  QueryClientProvider as TanstackQueryProvider,
  QueryClient as TanstackQueryClient,
} from "@tanstack/react-query";
import { type ReactNode } from "react";
import { MutinyClientContext } from "./context";

const tanstackQueryClient = new TanstackQueryClient();

interface ProviderProps {
  client: MutinyClient;
  children: ReactNode;
}

export function Provider({ client, children }: ProviderProps) {
  return (
    <MutinyClientContext.Provider value={client}>
      <TanstackQueryProvider client={tanstackQueryClient}>
        {children}
      </TanstackQueryProvider>
    </MutinyClientContext.Provider>
  );
}
