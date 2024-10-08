import { $ } from "bun";
import { config } from "@dotenvx/dotenvx";

config();

const DATABASE_URL = await $`bun run setup-ephemeral`
  .cwd("../../packages/db")
  .quiet()
  .text();

$.env({
  NODE_ENV: "test",
  DATABASE_URL,
  FORCE_COLOR: "1",
});

await $`vitest run -r ./tests`.nothrow();
