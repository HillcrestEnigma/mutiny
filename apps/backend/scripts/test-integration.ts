import { $ } from "bun";
import { tmpfile } from "zx";
import { config } from "@dotenvx/dotenvx";

config();

const dbFile = tmpfile();
$.env({
  NODE_ENV: "test",
  DATABASE_URL: `file:${dbFile}`,
  FORCE_COLOR: "1",
});

await $`prisma db push --skip-generate`.cwd("../../packages/db").quiet();

await $`vitest run -r ./tests`.nothrow();
