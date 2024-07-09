import { $, argv } from "zx";
import { config } from "@dotenvx/dotenvx";

config({
  path: [".env", ".env.local", ".env.test"],
});
process.env.FORCE_COLOR = "1";

await $`pnpm run db:migrate:apply`;

const args = [argv.watch ? "watch" : "run", "-r", "./tests"];

await $({
  nothrow: true,
  stdio: "inherit",
})`vitest ${args}`;
