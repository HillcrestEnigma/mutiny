import { $ } from "bun";
import { config } from "@dotenvx/dotenvx";

config({ path: "../../apps/backend/.env" });

const DATABASE_URL = await $`bun run setup-ephemeral`
  .cwd("../../packages/db")
  .quiet()
  .text();

$.env({
  NODE_ENV: "test",
  DATABASE_URL,
  FORCE_COLOR: "1",
  FORCE_LOG: "1",
});

await $`bun test --preload ./setup.ts`.cwd("./tests").nothrow();
