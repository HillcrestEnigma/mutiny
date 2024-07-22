import { MutinyClient, type MutinyClientOptions } from "@repo/client";
import {
  QueryClientProvider as TanstackQueryProvider,
  QueryClient as TanstackQueryClient,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { MutinyClientContext, type OptionalMutinyClient } from "./context";

const tanstackQueryClient = new TanstackQueryClient();

interface MutinyProviderProps {
  config: MutinyClientOptions;
  children: ReactNode;
}

export function MutinyProvider({ config, children }: MutinyProviderProps) {
  const [client] = useState<OptionalMutinyClient>(MutinyClient(config));

  return (
    <MutinyClientContext.Provider value={client}>
      <TanstackQueryProvider client={tanstackQueryClient}>
        {children}
      </TanstackQueryProvider>
    </MutinyClientContext.Provider>
  );
}
