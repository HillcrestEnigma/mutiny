import { spyOn, type Mock } from "bun:test";
import { MutinyClient } from "../src/factory";
import type { SessionGetter, SessionSetter } from "../src/client";

export let session: string | null = null;

export let client: MutinyClient;

export let clientSessionGetterSpy: Mock<SessionGetter>;
export let clientSessionSetterSpy: Mock<SessionSetter>;

export function createClient() {
  client = MutinyClient("http://localhost:4000/api", {
    sessionGetter: () => session,
    sessionSetter: (newSession) => {
      session = newSession;
    },
  });

  clientSessionGetterSpy = spyOn(client, "sessionGetter");
  clientSessionSetterSpy = spyOn(client, "sessionSetter");
}
