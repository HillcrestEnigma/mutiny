import { spyOn, type Mock } from "bun:test";
import { MutinyClient } from "../src/factory";
import type { SessionGetter, SessionSetter } from "../src/client";

export let session: string | null = null;

export let client: MutinyClient;

export let clientSessionGetterSpy: Mock<SessionGetter>;
export let clientSessionSetterSpy: Mock<SessionSetter>;

export function createClient() {
  client = MutinyClient({
    baseURL: "http://localhost:4000/api",
    sessionGetter: async () => session,
    sessionSetter: async (newSession) => {
      session = newSession;
    },
  });

  clientSessionGetterSpy = spyOn(client, "sessionGetter");
  clientSessionSetterSpy = spyOn(client, "sessionSetter");
}
