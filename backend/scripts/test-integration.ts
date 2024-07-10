import { $, argv } from "zx";
import { config } from "@dotenvx/dotenvx";

config({
  path: ["./.env", "./.env.development", "./.env.test"],
  overload: true,
});
process.env.FORCE_COLOR = "1";

await $`prisma db push`;

const args = [argv.watch ? "watch" : "run", "-r", "./tests"];

await $({
  nothrow: true,
  stdio: "inherit",
})`vitest ${args}`;
